// const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');
const Joi = require('joi');
const createError = require('http-errors');
const mongoose = require('mongoose');
const { responseError } = require('../utils/Response/error');
const redisClient = require('../configs/redis/index');
const { User, labelOfGender } = require('../models/User');
const authMethod = require('../auth/auth.method');
const { populateUserByEmail } = require('../utils/Populate/User.populate');

const hostClient = process.env.HOST_CLIENT;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

class AuthController {
	// Dang ky
	async registerUser(req, res, next) {
		try {
			const schema = Joi.object({
				password: Joi.string().required(),
				confirmPassword: Joi.string().required().valid(Joi.ref('password')),
				email: Joi.string().email().required(),
				fullname: Joi.string().required(),
				gender: Joi.object({
					value: Joi.string().valid('male', 'female', 'other').required(),
				}),
				otp: Joi.number().required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			// get OTP from redis
			const otp = await redisClient.get(`verify:${req.body.email}`);
			if (!otp) {
				return responseError(res, 400, 'OTP không tồn tại!');
			}

			// check OTP
			if (req.body.otp !== otp) {
				return responseError(res, 400, 'OTP không chính xác!');
			}

			// generate new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);

			// create new user
			const newUser = new User({
				fullname: req.body.fullname,
				email: req.body.email,
				password: hashedPassword,
				gender: {
					value: req.body.gender.value,
					label: labelOfGender[req.body.gender.value],
				},
			});

			const dataToken = {
				userId: newUser._id,
				role: 'USER',
			};

			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			if (!accessToken) {
				return responseError(res, 401, 'Đăng ký không thành công, vui lòng thử lại.');
			}
			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);
			newUser.refreshToken = refreshToken;
			await newUser.save();

			return res.status(200).json({
				msg: 'Đăng ký thành công.',
				accessToken,
				refreshToken,
				user: newUser,
			});
		} catch (err) {
			if (err.code === 11000) {
				return responseError(res, 400, 'Email đã tồn tại!');
			}
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async loginGoogle(req, res, next) {
		try {
			const { user } = req;
			const dataToken = {
				userId: user._id,
			};
			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);

			const userSave = await User.findById(user._id);
			if (user.lockTime - Date.now() > 0 || user.isPermanentlyLocked === true) {
				if (user.isPermanentlyLocked) return responseError(res, 401, 'Tài khoản của bạn đã bị khóa vĩnh viễn');
				return responseError(
					res,
					401,
					`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`
				);
			}
			userSave.refreshToken = refreshToken;
			userSave.isVerified = true;
			await userSave.save();

			return res.redirect(
				`${hostClient}/auth/login/google?accessToken=${accessToken}&refreshToken=${refreshToken}`
			);
		} catch (err) {
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async login(req, res, next) {
		try {
			// validate
			const schema = Joi.object({
				email: Joi.string().min(6).max(255).required().email(),
				password: Joi.string().min(6).max(1024).required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			const user = await populateUserByEmail(req.body.email);
			if (!user) {
				return responseError(res, 401, 'Email không tồn tại.');
			}

			if (user.password == null) {
				return responseError(
					res,
					401,
					'Tài khoản chưa đặt mật khẩu. Vui lòng đăng nhập bằng Google, và đặt mật khẩu mới!!!'
				);
			}

			// check account is being blocked (LockTime - current time > 0)
			if (user.lockTime - Date.now() > 0 || user.isPermanentlyLocked === true) {
				if (user.isPermanentlyLocked) return responseError(res, 401, 'Tài khoản của bạn đã bị khóa vĩnh viễn');
				return responseError(
					res,
					401,
					`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`
				);
			}

			const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
			if (!isPasswordValid) {
				// increase login attempt
				user.loginAttempts++;
				// eslint-disable-next-line eqeqeq
				if (user.loginAttempts == 3) {
					// lock account after 5 minutes
					user.lockTime = Date.now() + 5 * 60 * 1000;
					await user.save();
					return responseError(res, 401, 'Tài khoản đã bị khóa. Vui lòng thử lại sau 5 phút!!!');
				}
				if (user.loginAttempts > 3) {
					// lock account forever
					user.lockTime = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000;
					await user.save();
					return responseError(
						res,
						401,
						'Tài khoản đã bị khóa vĩnh viễn, Vui lòng liên hệ admin để được hỗ trợ!!!'
					);
				}
				await user.save();
				return responseError(res, 401, 'Mật khẩu không chính xác.');
			}
			// reset login attempt
			user.loginAttempts = 0;

			const dataToken = {
				userId: user._id,
				role: user.role.name,
			};

			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			if (!accessToken) {
				return responseError(res, 401, 'Đăng nhập không thành công, vui lòng thử lại.');
			}
			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);
			user.refreshToken = refreshToken;
			await user.save();

			// save refresh token to redis and set expire time
			// await redisClient.set(user._id, refreshToken);
			// await redisClient.expire(user._id, 7 * 24 * 60 * 60);

			return res.status(200).json({
				msg: 'Đăng nhập thành công.',
				accessToken,
				refreshToken,
				user,
			});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async refreshToken(req, res, next) {
		try {
			// validate token
			const schema = Joi.object({
				refreshToken: Joi.string().required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			// get refresh token from body
			const refreshTokenFromBody = req.body.refreshToken;
			if (!refreshTokenFromBody) {
				return responseError(res, 400, 'Không tìm thấy refresh token.');
			}

			// Decode access token đó
			const decoded = await authMethod.decodeToken(refreshTokenFromBody, refreshTokenSecret);
			if (!decoded) {
				return responseError(res, 400, 'Refresh token không hợp lệ.');
			}
			const { userId } = decoded.payload;
			// Check refreshToken with database
			const user = await User.findById(mongoose.Types.ObjectId(userId));
			if (!user) {
				return responseError(res, 400, 'Không tìm thấy người dùng.');
			}

			if (user.lockTime - Date.now() > 0) {
				return responseError(
					res,
					401,
					`Tài khoản đã bị khóa.Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()} `
				);
			}

			if (user.refreshToken !== refreshTokenFromBody) {
				return responseError(res, 401, 'Refresh token không hợp lệ hoặc đã hết hạn');
			}

			// Generate new access token
			const dataToken = {
				userId,
				role: user.role.name,
			};
			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);
			if (!accessToken) {
				return responseError(res, 400, 'Tạo access token không thành công, vui lòng thử lại.');
			}

			return res.json({
				accessToken,
			});
		} catch (err) {
			console.log(err.message);
			return next(
				createError.InternalServerError(
					`${err.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}

	// async sendLinkForgottenPassword(req, res, next) {
	// 	try {
	// 		const schema = Joi.object({
	// 			email: Joi.string().email().required(),
	// 		}).unknown();
	// 		const { error } = schema.validate(req.body);
	// 		if (error) {
	// 			return responseError(res, 400, error.details[0].message);
	// 		}

	// 		const user = await User.findOne({ email: req.body.email });
	// 		if (!user) {
	// 			return responseError(res, 400, 'Email không tồn tại!!!');
	// 		}

	// 		let token = await Token.findOne({ userId: user._id });
	// 		if (!token) {
	// 			token = await new Token({
	// 				userId: user._id,
	// 				token: crypto.randomBytes(32).toString('hex'),
	// 			}).save();
	// 		}

	// 		const link = `${process.env.BASE_URL}?id=${user._id}&token=${token.token}`;
	// 		const status = await sendEmail(user.email, 'Password reset', link, user);
	// 		// check status
	// 		if (!status) {
	// 			return responseError(res, 400, 'Gửi email thất bại!!!');
	// 		}
	// 		res.send('Link reset mật khẩu đã được gửi qua email của bạn');
	// 	} catch (error) {
	// 		console.log(error);
	// 		return next(
	// 			createError.InternalServerError(`${error.message} in method: ${req.method} of ${req.originalUrl} `)
	// 		);
	// 	}
	// }

	async setPassword(req, res, next) {
		try {
			const schema = Joi.object({
				newPassword: Joi.string().required(),
				confirmPassword: Joi.string().required(),
				otp: Joi.number().required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			const user = await User.findById(req.user._id);
			if (!user) {
				return responseError(res, 400, 'Không tìm thấy người dùng');
			}

			// check newPassword and confirmPassword
			if (req.body.newPassword !== req.body.confirmPassword) {
				return responseError(res, 400, 'Mật khẩu mới và xác nhận mật khẩu không khớp');
			}

			// generate new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

			// get opt from redis
			const otp = await redisClient.get(`comfirm:${req.user._id}`);
			if (!otp) {
				return responseError(res, 400, 'Mã OTP đã hết hạn');
			}

			// verify opt
			const isVerify = otp.toString() === req.body.otp.toString();
			if (!isVerify) {
				return responseError(res, 400, 'Mã OTP không đúng');
			}

			// save new password
			user.password = hashedPassword;
			await user.save();
			redisClient.del(`comfirm:${req.user._id}`); // delete otp

			return res.status(200).json('Đặt mật khẩu thành công!!!');
		} catch (error) {
			console.log(error.message);
			return next(
				createError.InternalServerError(
					`${error.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}

	async logout(req, res, next) {
		try {
			const userId = req.user._id;
			await redisClient.del(userId);
			res.send('Đăng xuất thành công!!!');
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}
}
module.exports = new AuthController();

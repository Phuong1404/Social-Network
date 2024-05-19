const Joi = require('joi');
const moment = require('moment');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const UserController = require('./User.controller');
const AccessController = require('./Access.controller');
const { User } = require('../models/User.model');
const authMethod = require('../auth/auth.method');
const { populateUserByEmail } = require('../utils/Populate/User.populate');
const { responseError } = require('../utils/Response/error');

class AdminController {
	async getDashboard(req, res, next) {
		try {
			const totalUser = await UserController.getTotalUser(req, res, next);
			const numUserOnline = await UserController.getNumUserOnline(req, res, next);
			const numAccessInDay = await AccessController.getNumAccessInDay(req, res, next);
			const numUserCreateInDay = await UserController.getUserCreated(req, res, next).then((data) => data.length);
			return res.status(200).json({
				totalUser,
				numUserOnline,
				numAccessInDay,
				numUserCreateInDay,
			});
		} catch (error) {
			console.log(error);
			return next(createError.InternalServerError(error.message));
		}
	}

	async login(req, res, next) {
		try {
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


			if (user.role.name != 'ADMIN') {
				return responseError(res, 401, 'Bạn không có quyền truy cập tính năng này.');
			}

			if (user.password == null) {
				return responseError(
					res,
					401,
					'Tài khoản chưa đặt mật khẩu. Vui lòng đăng nhập bằng Google, và đặt mật khẩu mới!!!'
				);
			}
			if (user.lockTime - Date.now() > 0) {
				return responseError(
					res,
					401,
					`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).fromNow()}`
				);
			}

			const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
			if (!isPasswordValid) {
				user.loginAttempts++;

				if (user.loginAttempts == 3) {
					user.lockTime = Date.now() + 5 * 60 * 1000;
					await user.save();
					return responseError(res, 401, 'Tài khoản đã bị khóa. Vui lòng thử lại sau 5 phút!!!');
				}
				if (user.loginAttempts > 3) {
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

			user.loginAttempts = 0;
			await user.save();

			const dataToken = {
				userId: user._id,
				role: user.role.name,
			};

			const accessToken = await authMethod.generateToken(
				dataToken,
				process.env.ACCESS_TOKEN_SECRET,
				process.env.ACCESS_TOKEN_LIFE
			);

			if (!accessToken) {
				return responseError(res, 401, 'Đăng nhập không thành công, vui lòng thử lại.');
			}
			const refreshToken = await authMethod.generateToken(
				dataToken,
				process.env.REFRESH_TOKEN_SECRET,
				process.env.REFRESH_TOKEN_LIFE
			);

			user.refreshToken = refreshToken;
			await user.save();

			return res.status(200).json({
				msg: 'Đăng nhập thành công.',
				accessToken,
				refreshToken,
				user,
			});
		} catch (error) {
			console.log(error);
			return next(error.message);
		}
	}

	async chartAccessUser(req, res, next) {
		try {
			const access = await AccessController.dailyAccessSevenDaysAgo(
				req.query.start,
				req.query.end,
				req.query.type
			);
			const user = await UserController.getNumUserCreatedDaily(req.query.start, req.query.end, req.query.type);

			const mergedData = {};
			access.forEach((item) => {
				const { day } = item;
				if (!mergedData[day]) {
					mergedData[day] = {};
				}
				mergedData[day].totalAccess = item.totalAccess;
			});

			user.forEach((item) => {
				const { day } = item;
				if (!mergedData[day]) {
					mergedData[day] = {};
				}
				mergedData[day].totalUserCreations = item.totalUserCreations;
			});

			return res.status(200).json(mergedData);
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(
					`${error.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async statictisUserPieChart(req, res, next) {
		try {
			const statictisBy = req.query.by;
			if (statictisBy == 'age') {
				const statictisByAge = await UserController.statisticsUserByAge(req, res, next);
				return res.status(200).json(statictisByAge);
			}
			if (statictisBy == 'gender') {
				const statictisByGender = await UserController.statisticsUserByGender(req, res, next);
				return res.status(200).json(statictisByGender);
			}
			return next(createError(400, 'Invalid statictisBy'));
		} catch (error) {
			console.log(error);
			return next(createError.InternalServerError(error.message));
		}
	}

	async changePassword(req, res, next) {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ email });
			if (!user) {
				return next(createError(400, 'Email không tồn tại'));
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			user.password = hashedPassword;
			await user.save();
			return res.status(200).json('Đổi mật khẩu thành công');
		} catch (error) {
			console.log(error);
			return next(createError.InternalServerError(error.message));
		}
	}

	async getListNewUser(req, res, next) {
		try {
			const users = await UserController.getUserCreated(req, res, next);
			return res.status(200).json(users);
		} catch (error) {
			console.log(error);
			return next(createError.InternalServerError(error.message));
		}
	}

	async searchUser(req, res, next) {
		try {
			await UserController.searchUser(req, res,next);
		} catch (error) {
			return next(createError.InternalServerError(error.message));
		}
	}

	async searchAdmin(req, res, next) {
		try {
			await UserController.searchAdmin(req, res,next);
		} catch (error) {
			return next(createError.InternalServerError(error.message));
		}
	}
}

module.exports = new AdminController();

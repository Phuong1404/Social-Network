const Joi = require('joi');
const createError = require('http-errors');
const crypto = require('crypto');
const Message = require('../models/Message.model');
const { getPagination } = require('../utils/mongoose.utils');
const Conversation = require('../models/Conversation.model');
const SocketManager = require('../socket/socket.manager.socket');
const { eventName } = require('../socket/constant.socket');
const { getListData } = require('../utils/Response/listData');
const { responseError } = require('../utils/Response/error');

const algorithm = 'aes-256-cbc';

class MessageController {
	async getAll(req, res) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

		Message.paginate({}, { offset, limit })
			.then((data) => {
				getListData(res, data);
			})
			.catch((err) => responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.'));
	}

	async fetchMessages(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

			const conversation = await Conversation.findById(req.params.conversationId);
			let index = -1;
			index = conversation.user_deleted.findIndex((item) => item.userId.toString() == req.user._id.toString());
			let deletedDate = new Date(-1);
			if (index != -1) {
				deletedDate = conversation.user_deleted[index].deletedAt;
			}
			if (conversation.members.some((mem) => mem.user.toString() == req.user._id.toString())) {
				Message.paginate(
					{ conversation: req.params.conversationId, createdAt: { $gte: deletedDate } },
					{
						offset,
						limit,
						sort: { createdAt: -1 },
						populate: [
							{
								path: 'sender',
								select: '_id  fullname profilePicture',
								populate: {
									path: 'profilePicture',
									select: '_id link',
								},
							},
							{
								path: 'media',
							},
						],
					}
				)
					.then((data) => {
						data.docs.forEach(async (message) => {
							await update_read(message.id,req.user._id)
							if (message.iv) {
								const iv = Buffer.from(message.iv, 'base64');
								const decipher = crypto.createDecipheriv(algorithm, 'social-network', iv);
								let decryptedData = decipher.update(message.text, 'hex', 'utf-8');
								decryptedData += decipher.final('utf-8');
								message.text = decryptedData;
							}
						});
						getListData(res, data);
					})
					.catch((err) =>
						responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
					);
			} else {
				return responseError(res, 403, 'Bạn không có trong cuộc hội thoại này!!!');
			}
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

	async add(req, res, next) {
		try {
			const schema = Joi.object({
				text: Joi.string().min(0),
				media: Joi.array().items(Joi.string()),
			})
				.or('text', 'media')
				.unknown();

			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}

			const conversation = await Conversation.findById(req.params.conversationId);
			if (conversation.members.some((mem) => mem.user.toString() == req.user._id.toString())) {
				const iv = crypto.randomBytes(16);

				const cipher = crypto.createCipheriv(algorithm, 'social-network', iv);
				let encryptedData = cipher.update(req.body.text, 'utf-8', 'hex');
				encryptedData += cipher.final('hex');

				const base64data = Buffer.from(iv).toString('base64');

				const newMessage = new Message(req.body);
				newMessage.iv = base64data;
				newMessage.text = encryptedData;
				newMessage.conversation = conversation._id;
				newMessage.sender = req.user._id;
				const savedMessage = await newMessage.save();
				const message = await Message.findById(savedMessage._id)
					.populate({
						path: 'sender',
						select: '_id  fullname profilePicture',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
					});
				conversation.lastest_message = savedMessage._id;
				await conversation.save();
				message.text = req.body.text;

				const userIds = conversation.members
					.filter((member) => member.user.toString() != message.sender._id.toString())
					.map((menber) => menber.user.toString());

				SocketManager.sendToList(userIds, eventName.SEND_MESSAGE, message);

				res.status(200).json(message);
			} else {
				next(createError(403, 'Bạn không có trong cuộc hội thoại này!!!'));
			}
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

	async update_read(id,user_id){
		try{
			const message = await Message.findById(id);
			if (!message.reader.includes(user_id)) message.reader.push(user_id);
			await message.save();
		}
		catch(err){
			console.log(err,'=======================')
		}
	}

	async update(req, res, next) {
		try {
			const message = await Message.findById(req.params.id);
			if (!message.reader.includes(req.user._id)) message.reader.push(req.user._id);
			await message.save();
			res.status(200).json(message);
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

	async delete(req, res, next) {
		try {
			const message = await Message.findById(req.params.id);
			if (message.sender.toString() == req.user._id.toString()) {
				await message.delete();
				res.status(200).json(message);
			} else {
				return responseError(res, 401, 'Bạn không có quyền xóa tin nhắn này');
			}
		} catch (err) {
			console.error(err);
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
}

module.exports = new MessageController();

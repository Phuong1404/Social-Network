const createError = require('http-errors');
const Joi = require('joi');
const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const React = require('../models/React.model');
const { User } = require('../models/User.model');
const { getPagination } = require('../utils/mongoose.utils');
const {
	notificationCreateComment,
	notificationReplyComment,
	notificationReactComment,
	notificationTagComment,
} = require('../utils/Notification/Comment.notification');

const {
	createActivityWithComment,
	createActivityWithReplyComment,
	createActivityWithReactComment,
} = require('../utils/Activity/comment.activity.util');

const { getListPost } = require('../utils/Response/listData');
const { responseError } = require('../utils/Response/error');
const { checkBadWord } = require('../utils/CheckContent/filter.util');

class CommentController {
	async get(req, res, next) {
		try {
			let comment = await Comment.findOneWithDeleted({ _id: req.params.id }).populate({
				path: 'author',
				select: '_id fullname profilePicture isOnline',
				populate: {
					path: 'profilePicture',
					select: '_id link',
				},
			});

			if (req.user.role.name != 'ADMIN' && req.user._id.toString() != comment.author._id.toString()) {
				comment = await Comment.findById(req.params.id).populate({
					path: 'author',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				});
			}

			if (!comment) {
				return responseError(res, 404, 'Comment not found');
			}

			let reactOfUser = 'none';
			if (req.user) {
				const react = await React.findOne({ comment: req.params.id, user: req.user._id });
				if (react) {
					reactOfUser = react.type;
				}
			}

			const commentObject = comment.toObject();
			commentObject.reactOfUser = reactOfUser;
			res.status(200).json(commentObject);
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

	async getAllOfPost(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		try {
			Comment.paginate(
				{ post: req.params.postId, replyTo: null },
				{
					offset,
					limit,
					sort: { createdAt: -1 },
					populate: [
						{
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{ path: 'media', select: '_id name link' },
					],
				}
			)
				.then((data) => {
					const comments = data.docs;
					const listComments = [];
					Promise.all(
						comments.map(async (comment) => {
							const commentObject = comment.toObject();
							commentObject.reactOfUser = 'none';
							if (req.user) {
								const react = await React.findOne({ comment: comment._id, user: req.user._id });
								if (react) {
									commentObject.reactOfUser = react.type;
								}
							}
							listComments.push(commentObject);
						})
					).then(() => {
						listComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
						getListPost(res, data, listComments);
					});
				})
				.catch((err) =>
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
				);
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

	async getAllReplies(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		try {
			Comment.paginate(
				{ replyTo: req.params.id },
				{
					offset,
					limit,
					sort: { createdAt: 1 },
					populate: [
						{
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{ path: 'media', select: '_id name link' },
					],
				}
			)
				.then((data) => {
					const comments = data.docs;
					const listComments = [];
					Promise.all(
						comments.map(async (comment) => {
							const commentObject = comment.toObject();
							commentObject.reactOfUser = 'none';
							if (req.user) {
								const react = await React.findOne({ comment: comment._id, user: req.user._id });
								if (react) {
									commentObject.reactOfUser = react.type;
								}
							}
							listComments.push(commentObject);
						})
					).then(() => {
						listComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
						getListPost(res, data, listComments);
					});
				})
				.catch((err) =>
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
				);
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

	async addReply(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id);
			if (comment) {
				const schema = Joi.object({
					content: Joi.string().required(),
					media: Joi.array().items(Joi.string()),
				}).unknown();
				const { error } = schema.validate(req.body);
				if (error) {
					return next(createError(400, error.details[0].message));
				}
				const newComment = new Comment(req.body);
				newComment.author = req.user._id;
				newComment.post = req.params.postId;
				newComment.replyTo = req.params.id;
				const savedComment = await newComment.save();

				await notificationReplyComment(comment, savedComment, req.user);
				await notificationTagComment(savedComment, req.user);

				await createActivityWithReplyComment(savedComment, req.user);
				if (savedComment.author.toString() != req.user._id.toString()) {
					const user = await User.findById(req.user._id);
					user.friends.forEach((friend, index, arr) => {
						if (friend.user._id.toString() == savedComment.author.toString()) {
							arr[index].interactionScore += 2;
						}
					});
					user.save();
				}

				await Post.findByIdAndUpdate(req.params.postId, { $inc: { numberComment: 1 } });

				await Comment.findByIdAndUpdate(req.params.id, { $inc: { numberReply: 1 } });

				const commentPopulated = await Comment.findById(savedComment._id)
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link',
					});
				return res.status(200).json(commentPopulated);
			}
			return responseError(res, 404, 'Bình luận không tồn tại');
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
				content: Joi.string().required(),
				tags: Joi.array().items(Joi.string()),
				media: Joi.array().items(Joi.string()),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}
			const check = await checkBadWord(req.body.content);
			if (check) {
				return next(
					createError.BadRequest(
						'Vuii lòng kiểm tra nội dung bình luận, do có chưa ngôn từ vi phạm tiêu chuẩn cộng đồng'
					)
				);
			}

			const newComment = new Comment(req.body);
			newComment.author = req.user._id;
			newComment.post = req.params.postId;
			const post = await Post.findById(req.params.postId);
			if (post) {
				const savedComment = await newComment.save();
				post.lastestFiveComments.unshift(savedComment._id);
				if (post.lastestFiveComments.length > 5) {
					post.lastestFiveComments.pop();
				}
				await post.save();

				await Post.findByIdAndUpdate(req.params.postId, { $inc: { numberComment: 1 } });

				await notificationCreateComment(post, savedComment, req.user);
				await notificationTagComment(savedComment, req.user);

				if (savedComment.author.toString() != req.user._id.toString()) {
					const user = await User.findById(req.user._id);
					user.friends.forEach((friend, index, arr) => {
						if (friend.user._id.toString() == savedComment.author.toString()) {
							arr[index].interactionScore += 2;
						}
					});
					user.save();
				}

				await createActivityWithComment(savedComment, req.user);

				const comment = await Comment.findById(savedComment._id)
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link',
					});
				return res.status(200).json(comment);
			}
			return responseError(res, 404, 'Bài viết không tồn tại');
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

	async update(req, res, next) {
		try {
			const schema = Joi.object({
				content: Joi.string().required(),
				media: Joi.array().items(Joi.string()),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}
			const comment = await Comment.findById(req.params.id);
			if (!comment) return next(createError(404, 'Bình luận không tồn tại'));
			if (comment.author.toString() == req.user._id.toString()) {
				const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link',
					});

				return res.status(200).json(commentUpdated);
			}
			return responseError(res, 401, 'Bạn không có quyền cập nhật bình luận này');
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(`${error.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	async react(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id);
			if (comment) {
				const reactOfUser = await React.findOne({ user: req.user._id, comment: req.params.id });
				if (reactOfUser && reactOfUser.type.toString() == req.body.type.toString()) {
					await React.findByIdAndDelete(reactOfUser._id);
					await Comment.findByIdAndUpdate(req.params.id, { $inc: { numberReact: -1 } });

					const commentUpdated = await Comment.findById(req.params.id)
						.populate({
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						})
						.populate({
							path: 'media',
							select: '_id link',
						});

					const commentWithReactUser = commentUpdated.toObject();
					commentWithReactUser.reactOfUser = 'none';
					res.status(200).json(commentWithReactUser);
				} else if (reactOfUser && reactOfUser.type.toString() != req.body.type.toString()) {
					await React.findByIdAndUpdate(reactOfUser._id, { $set: { type: req.body.type } });

					const commentUpdated = await Comment.findById(req.params.id)
						.populate({
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						})
						.populate({
							path: 'media',
							select: '_id link',
						});

					const commentWithReactUser = commentUpdated.toObject();
					commentWithReactUser.reactOfUser = req.body.type;
					res.status(200).json(commentWithReactUser);
				} else {
					const newReact = new React({ user: req.user._id, comment: req.params.id, type: req.body.type });
					await newReact.save();
					await Comment.findByIdAndUpdate(req.params.id, { $inc: { numberReact: 1 } });

					await notificationReactComment(comment, req.user);

					await createActivityWithReactComment(comment, req.user);
					if (comment.author.toString() != req.user._id.toString()) {
						const user = await User.findById(req.user._id);
						user.friends.forEach((friend, index, arr) => {
							if (friend.user._id.toString() == comment.author.toString()) {
								arr[index].interactionScore += 2;
							}
						});
						user.save();
					}

					const commentUpdated = await Comment.findById(req.params.id)
						.populate({
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						})
						.populate({
							path: 'media',
							select: '_id link',
						});

					const commentWithReactUser = commentUpdated.toObject();
					commentWithReactUser.reactOfUser = req.body.type;
					return res.status(200).json(commentWithReactUser);
				}
			} else {
				return responseError(res, 404, 'Bình luận không tồn tại');
			}
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

	async deleteComment(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id).populate(
				'author',
				'_id fullname profilePicture isOnline'
			);
			const post = await Post.findById(req.params.postId);
			if (comment) {
				if (
					comment.author._id.toString() == req.user._id.toString() ||
					post.author.toString() == req.user._id.toString() ||
					req.user.role.name == 'ADMIN'
				) {
					await comment.delete();
					const index = post.lastestFiveComments.indexOf(req.params.id);
					if (index > -1) {
						post.lastestFiveComments = await Comment.find({ post: req.params.postId, replyTo: null })
							.sort({ createdAt: -1 })
							.limit(5)
							.select('_id');
					}
					const numberReplyDeleted = await Comment.deleteMany({ replyTo: req.params.id });
					await Post.findByIdAndUpdate(req.params.postId, {
						$inc: { numberComment: -1 - numberReplyDeleted.deletedCount },
					});
					await post.save();
					return comment;
				}
				return responseError(res, 401, 'Bạn không có quyền xóa bình luận này');
			}
			return responseError(res, 404, 'Bình luận không tồn tại');
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

	async delete(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id).populate(
				'author',
				'_id fullname profilePicture isOnline'
			);
			const post = await Post.findById(req.params.postId);
			if (comment) {
				if (
					comment.author._id.toString() == req.user._id.toString() ||
					post.author.toString() == req.user._id.toString() ||
					req.user.role.name == 'ADMIN'
				) {
					await comment.delete();
					const index = post.lastestFiveComments.indexOf(req.params.id);
					if (index > -1) {
						post.lastestFiveComments = await Comment.find({ post: req.params.postId, replyTo: null })
							.sort({ createdAt: -1 })
							.limit(5)
							.select('_id');
					}
					const numberReplyDeleted = await Comment.deleteMany({ replyTo: req.params.id });
					await Post.findByIdAndUpdate(req.params.postId, {
						$inc: { numberComment: -1 - numberReplyDeleted.deletedCount },
					});
					await post.save();
					return res.status(200).json(comment);
				}
				return responseError(res, 401, 'Bạn không có quyền xóa bình luận này');
			}
			return responseError(res, 404, 'Bình luận không tồn tại');
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
}

module.exports = new CommentController();

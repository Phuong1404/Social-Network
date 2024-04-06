const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const CommentSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		content: {
			type: String,
		},
		media: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'File',
				default: [],
			},
		],
		numberReact: {
			type: Number,
			default: 0,
		},
		numberReply: {
			type: Number,
			default: 0,
		},
		replyTo: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Comment',
		},
		tags: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		post: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Post',
		},
	},
	{ timestamps: true }
);

CommentSchema.plugin(mongoosePaginate);

CommentSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

module.exports = mongoose.model('Comment', CommentSchema);

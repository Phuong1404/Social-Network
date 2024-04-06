const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const { PrivacyModel } = require('./Privacy.model');

const PostSchema = new mongoose.Schema(
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
		lastestFiveComments: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'Comment',
				default: [],
			},
		],
		numberReact: {
			type: Number,
			default: 0,
		},
		numberShare: {
			type: Number,
			default: 0,
		},
		numberComment: {
			type: Number,
			default: 0,
		},
		tags: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		sharedPost: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Post',
		},
		privacy: {
			type: PrivacyModel.schema,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
	},
	{ timestamps: true }
);
PostSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);

const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const ReactSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
			default: 'like',
			required: true,
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true,
		},
		post: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Post',
		},
		album: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Album',
		},
		comment: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Comment',
		},
		message: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Message',
		},
	},
	{ timestamps: true }
);

ReactSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

ReactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('React', ReactSchema);

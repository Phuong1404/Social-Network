const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const { PrivacyModel } = require('./Privacy.model');

const AlbumSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		size: {
			type: Number,
			default: 0,
		},
		cover: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'File',
		},
		author: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true,
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

AlbumSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

AlbumSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Album', AlbumSchema);

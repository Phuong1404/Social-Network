const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const AccessSchema = new mongoose.Schema(
	{
		day: {
			type: Date,
			default: Date.now,
		},
		totalAccess: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

AccessSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

AccessSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Access', AccessSchema);

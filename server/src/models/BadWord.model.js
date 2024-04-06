const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const BadWordSchema = new mongoose.Schema(
	{
		words: {
			type: [String],
			require: true,
		},
	},
	{ timestamps: true }
);

BadWordSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

BadWordSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('BadWord', BadWordSchema);

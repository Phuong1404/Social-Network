const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const HobbySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true }
);
HobbySchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

HobbySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Hobby', HobbySchema);

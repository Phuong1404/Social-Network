const mongoose = require('mongoose');
const Joi = require('joi');

const PrivacySchema = mongoose.Schema(
	{
		value: {
			type: String,
			enum: ['public', 'private', 'friends', 'includes', 'excludes'],
			default: 'public',
		},
		excludes: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		includes: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				default: [],
			},
		],
	},
	{ _id: false }
);


const validate = () => {
	const schema = Joi.object({
		value: Joi.string().valid('public', 'private', 'friends', 'includes', 'excludes').required(),
		excludes: Joi.when('value', {
			is: Joi.string().valid('excludes'),
			then: Joi.array().items(Joi.string().required()).required(),
			otherwise: Joi.array().items(Joi.string()),
		}),
		includes: Joi.when('value', {
			is: Joi.string().valid('includes'),
			then: Joi.array().items(Joi.string().required()).required(),
			otherwise: Joi.array().items(Joi.string()),
		}),
	});

	return schema;
};

const PrivacyModel = mongoose.model('Privacy', PrivacySchema);

module.exports = {
	PrivacyModel,
	validatePrivacy,
};

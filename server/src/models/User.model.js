const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const Joi = require('joi');
const { PrivacyModel, validatePrivacy } = require('./Privacy.model');

const contactSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['phone', 'email', 'facebook', 'twitter', 'instagram', 'github', 'linkedin', 'youtube', 'website'],
			required: true,
		},
		value: {
			type: String,
		},
		privacy: {
			type: PrivacyModel.schema,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
		brief: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

const educationSchema = mongoose.Schema(
	{
		school: {
			type: String,
		},
		from: {
			type: Date,
		},
		to: {
			type: Date,
		},
		degree: {
			type: String,
		},
		major: {
			type: String,
		},
		privacy: {
			type: PrivacyModel.schema,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
		brief: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

const workSchema = mongoose.Schema(
	{
		company: {
			type: String,
		},
		from: {
			type: Date,
		},
		to: {
			type: Date,
		},
		position: {
			type: String,
		},
		privacy: {
			type: PrivacyModel.schema,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
		brief: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

const addressSchema = mongoose.Schema(
	{
		country: {
			type: String,
			required: true,
		},
		province: {
			type: String,
			required: true,
		},
		district: {
			type: String,
		},
		address: {
			type: String,
		},
	},
	{ _id: false }
);

const friendSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		interactionScore: {
			type: Number,
			default: 0,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
);

const UserSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			min: 6,
		},
		isPermanentlyLocked: {
			type: Boolean,
			default: false,
		},
		reasonLock: {
			type: String,
		},
		lockTime: {
			type: Date,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		loginAttempts: {
			type: Number,
			default: 0,
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		lastAccess: {
			type: Date,
			default: Date.now(),
		},
		profilePicture: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'File',

		},
		coverPicture: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'File',
		},
		education: [educationSchema],
		work: [workSchema],
		contact: [contactSchema],
		friendRequests: [friendSchema],
		sentRequests: [friendSchema],
		friends: [friendSchema],
		followers: [friendSchema],
		followings: [friendSchema],
		city: {
			type: addressSchema,
		},
		from: {
			type: addressSchema,
		},
		gender: {
			type: String,
			enum: ['male', 'female', 'other'],
			default: 'male',
		},
		birthdate: {
			type: Date,
		},
		hobbies: {
			type: [String],
		},
		role: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Role',
			default: '663783a35fb83083f60765e1', // USER
		},
		refreshToken: {
			type: String,
		},
	},
	{ timestamps: true }
);


const hiddenField = ['password', 'refreshToken'];
const User = mongoose.model(
	'User',
	UserSchema.set('toJSON', {
		transform(doc, user) {
			hiddenField.forEach((field) => delete user[field]);
			return user;
		},
	})
);


UserSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});


UserSchema.plugin(mongoosePaginate);


const validate = (user) => {
	const schema = Joi.object({
		fullname: Joi.string().min(1).max(50),
		profilePicture: Joi.string(),
		coverPicture: Joi.string(),
		contact: Joi.array().items(
			Joi.object({
				type: Joi.string()
					.valid(
						'phone',
						'email',
						'facebook',
						'twitter',
						'instagram',
						'github',
						'linkedin',
						'youtube',
						'website'
					)
					.required(),
				value: Joi.string().min(1).max(100).required(),
				privacy: validatePrivacy(),
				brief: Joi.boolean(),
			})
		),
		work: Joi.array().items(
			Joi.object({
				company: Joi.string().min(1).max(200).required(),
				position: Joi.string().min(1).max(50).required(),
				from: Joi.date().required(),
				to: Joi.date().allow(null).allow(''),
				privacy: validatePrivacy(),
				brief: Joi.boolean(),
			})
		),
		education: Joi.array().items(
			Joi.object({
				school: Joi.string().min(1).max(200).required(),
				degree: Joi.string().min(1).max(50).required(),
				major: Joi.string().min(1).max(50).required(),
				from: Joi.date().required(),
				to: Joi.date().allow(null).allow(''),
				privacy: validatePrivacy(),
				brief: Joi.boolean(),
			})
		),
		city: Joi.object({
			country: Joi.string().min(1).max(200).required(),
			province: Joi.string().min(1).max(200).required(),
			district: Joi.string().min(1).max(200),
			ward: Joi.string().min(1).max(200),
			address: Joi.string().min(1).max(200),
		}),
		from: Joi.object({
			country: Joi.string().min(1).max(200).required(),
			province: Joi.string().min(1).max(200).required(),
			district: Joi.string().min(1).max(200),
			ward: Joi.string().min(1).max(200),
			address: Joi.string().min(1).max(200),
		}),
		birthdate: Joi.date(),
		hobbies: Joi.array().items(Joi.string().min(1).max(50)),
	});
	return schema.validate(user);
};

module.exports = { User, validate };

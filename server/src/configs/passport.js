const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const { User } = require('../models/User.model');
const File = require('../models/File.model');

module.exports = function passportConfig(passport) {
	// Google
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				if (profile.id) {
					User.findOne({ email: profile.emails[0].value }).then(async (existingUser) => {
						if (existingUser) {
							done(null, existingUser);
						} else {
							let avatar = null;
							if (profile.photos[0].value) {
								avatar = await File.create({
									name: profile.displayName,
									type: 'image',
									link: profile.photos[0].value,
								});
							}
							const newUser = new User({
								email: profile.emails[0].value,
								fullname: profile.displayName,
								profilePicture: avatar?._id,
								isVerified: true,
							});
							if (avatar) {
								await File.findByIdAndUpdate(avatar._id, {
									creator: newUser._id,
								});
							}
							const user = await newUser.save();
							done(null, user);
						}
					});
				} else {
					done(null, false);
				}
			}
		)
	);

	// Github
	passport.use(
		new GithubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: '/auth/github/callback',
				proxy: true,
				scope: ['user:email'],
			},
			async (accessToken, refreshToken, profile, done) => {
				if (profile.id) {
					User.findOne({ email: profile.emails[0].value }).then(async (existingUser) => {
						if (existingUser) {
							done(null, existingUser);
						} else {
							let avatar = null;
							if (profile.photos[0].value) {
								avatar = await File.create({
									name: profile.displayName,
									type: 'image',
									link: profile.photos[0].value,
								});
							}
							const newUser = new User({
								email: profile.emails[0].value,
								fullname: profile.displayName,
								profilePicture: avatar?._id,
								isVerified: true,
							});
							if (avatar) {
								await File.findByIdAndUpdate(avatar._id, {
									creator: newUser._id,
								});
							}
							const user = await newUser.save();
							done(null, user);
						}
					});
				} else {
					done(null, false);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user));
	});
};

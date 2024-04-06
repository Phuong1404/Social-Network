const { populateUser, populateUserForOther } = require('../Populate/User.populate');

async function getUserWithPrivacy(req, res) {
	try {
		console.log(res);
		let user;
		if (req.user && req.user._id.toString() === req.params.id.toString()) {
			user = await populateUser(req.params.id);
		} else {
			user = await populateUserForOther(req.params.id);
		}
		if (!user) return null;

		const fields = Object.keys(user._doc);
		const privacyFields = [];
		fields.forEach((field) => {
			// eslint-disable-next-line eqeqeq
			if (field == 'hobbies') {
				return;
			}
			if (typeof user[field] === 'object') {
				if (Array.isArray(user[field]) && user[field].length > 0) {
					if ('privacy' in user[field][0]) {
						privacyFields.push(field);
					}
				} else if ('privacy' in user[field]) {
					privacyFields.push(field);
				}
			}
		});

		if (!req.user) {
			privacyFields.forEach((field) => {
				if (Array.isArray(user[field])) {
					user[field] = user[field].filter((item) => item.privacy.value === 'public');
				} else {
					if (user[field].privacy.value !== 'public') {
						return;
					}
					user[field] = null;
				}
			});
			return user;
		}
		if (req.user._id.toString() === req.params.id.toString()) {
			return user;
		}
		// eslint-disable-next-line eqeqeq
		const isFriend = user.friends.some((friend) => friend.user._id.toString() == req.user._id.toString());
		privacyFields.forEach((field) => {
			// check if field is array
			if (Array.isArray(user[field])) {
				user[field] = user[field].filter((item) => {
					// check privacy of field
					// eslint-disable-next-line eqeqeq
					if (item.privacy.value == 'public') return true;
					// eslint-disable-next-line eqeqeq
					if (item.privacy.value == 'private') return false;
					// eslint-disable-next-line eqeqeq
					if (item.privacy.value == 'friends' && isFriend) return true;
					if (
						// eslint-disable-next-line eqeqeq
						item.privacy.value == 'includes' &&
						// eslint-disable-next-line eqeqeq
						item.privacy.includes.some((id) => id.toString() == req.user._id.toString()) &&
						isFriend
					)
						return true;
					if (
						// eslint-disable-next-line eqeqeq
						item.privacy.value == 'excludes' &&
						// eslint-disable-next-line eqeqeq
						!item.privacy.excludes.some((id) => id.toString() == req.user._id.toString()) &&
						isFriend
					)
						return true;
					return false;
				});
			} else {
				// check privacy of field
				const { privacy } = user[field];
				// eslint-disable-next-line eqeqeq
				if (privacy.value == 'public') {
					// eslint-disable-next-line eqeqeq
					if (privacy.excludes.some((id) => id.toString() == req.user._id.toString())) user[field] = null;
					// eslint-disable-next-line eqeqeq
				} else if (privacy.value == 'private') {
					user[field] = null;
					// eslint-disable-next-line eqeqeq
				} else if (privacy.value == 'friends') {
					if (!isFriend) user[field] = null;
					// eslint-disable-next-line eqeqeq
				} else if (privacy.value == 'includes') {
					// eslint-disable-next-line eqeqeq
					if (!privacy.includes.some((u) => u._id.toString() == req.user._id.toString())) user[field] = null;
					// eslint-disable-next-line eqeqeq
				} else if (privacy.value == 'excludes') {
					// eslint-disable-next-line eqeqeq
					if (privacy.exclues.some((u) => u._id.toString() == req.user._id.toString()) && !isFriend)
						user[field] = null;
				}
			}
		});
		return user;
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	getUserWithPrivacy,
};

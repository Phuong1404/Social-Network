const Activity = require('../../models/Activity.model');

async function createActivityWithFriendAccept(currentUser, user) {
	const activity = new Activity({
		type: 'friend',
		content: `Bạn đã chấp nhận lời mời kết bạn ${user.fullname}`,
		link: `/profile/${user._id}`,
		friend: user._id,
		user: currentUser._id,
	});
	await activity.save();
}

async function createActivityWithFriendRequest(currentUser, user) {
	const activity = new Activity({
		type: 'friend',
		content: `Bạn đã gửi lời mời kết bạn ${user.fullname}`,
		link: `/profile/${user._id}`,
		friend: user._id,
		user: currentUser._id,
	});
	await activity.save();
}

module.exports = {
	createActivityWithFriendRequest,
	createActivityWithFriendAccept,
};

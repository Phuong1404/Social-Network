const Notification = require('../../models/Notification.model');
const SocketManager = require('../../socket/socket.manager.socket');
const { eventName, notificationType } = require('../../socket/constant.socket');
const { populateNotification } = require('../Populate/Notification.populate');

async function notificationAcceptFriend(currentUser, user) {
	const friend = [user._id];
	const notification = await new Notification({
		type: 'friend',
		content: `${currentUser.fullname} đã chấp nhận lời mời kết bạn`,
		link: `/profile/${currentUser._id}`,
		sender: currentUser._id,
		receiver: friend,
	}).save();

	const popNotification = await populateNotification(notification);

	SocketManager.send(user._id, eventName.NOTIFICATION, {
		type: notificationType.ACCEPT_REQUEST_FRIEND,
		data: popNotification,
	});
}
async function notificationRequestFriend(currentUser, user) {
	const friend = [user._id];
	const notification = await new Notification({
		type: 'friend',
		content: `${currentUser.fullname} đã gửi lời mời kết bạn`,
		link: `/profile/${currentUser._id}`,
		sender: currentUser._id,
		receiver: friend,
	}).save();

	const popNotification = await populateNotification(notification);

	SocketManager.send(user._id, eventName.NOTIFICATION, {
		type: notificationType.SEND_REQUEST_FRIEND,
		data: popNotification,
	});
}

module.exports = {
	notificationRequestFriend,
	notificationAcceptFriend,
};

const AccessController = require('../app/controllers/AccessController');
const { User } = require('../models/User.model');
const SocketManager = require('./socket.manager.socket');
const RoomMagager = require('./room.manager.socket');
const authMethod = require('../auth/auth.method');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

function socket(io) {
	io.on('connection', (sk) => {
		console.log('New WS Connection...', sk.id);
		let userID;
		sk.on('login', async (token) => {
			const verified = await authMethod.verifyToken(token, accessTokenSecret);
			if (!verified) {
				console.log('Invalid token');
				return;
			}
			userID = verified.payload.userId;
			try {
				await AccessController.updateAccessInDay();

				const user = await User.findByIdAndUpdate(
					userID,
					{
						isOnline: true,
					},
					{ new: true }
				);
				SocketManager.addUser(userID, sk);

				SocketManager.sendAll(`online:${userID}`, user);
			} catch (err) {
				console.log(err);
			}
		});

		RoomMagager(sk, io);
		sk.on('disconnect', async () => {
			try {
				const user = await User.findByIdAndUpdate(
					userID,
					{
						isOnline: false,
						lastAccess: Date.now(),
					},
					{ new: true }
				);
				SocketManager.removeUser(userID);
				SocketManager.sendAll(`online:${userID}`, user);
			} catch (err) {
				console.log(err);
			}
		});
	});
}

module.exports = socket;

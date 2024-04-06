class SocketManager {
	constructor() {
		this._store = new Map();
	}

	addUser(userId, socket) {
		this._store.set(userId.toString(), socket);
	}

	removeUser(userId) {
		this._store.delete(userId.toString());
	}

	getUser(userId) {
		return this._store.get(userId.toString());
	}

	send(userId, event, data) {
		const socket = this.getUser(userId);
		if (!socket) return;
		socket.emit(event, data);
	}

	sendToList(userIds, event, data) {
		userIds.forEach((userId) => {
			this.send(userId, event, data);
		});
	}

	sendAll(event, data) {
		this._store.forEach((socket) => {
			socket.emit(event, data);
		});
	}
}
module.exports = new SocketManager();

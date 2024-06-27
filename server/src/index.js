const http = require('http');
require('dotenv').config();
const socketio = require('socket.io');

const app = require('./app');
const server = http.createServer(app);
const HOSTS = require('./configs/cors');

// socket
const io = socketio(server, {
	cors: {
		origin: "*",
	},
});

const Socket = require('./socket/index');

Socket(io);

const db = require('./configs/db/index');
db.connectMongoDB();

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
	console.log(`Server is listen on port ${PORT}`);
});

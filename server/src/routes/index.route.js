const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');
// const Message = require('./messages');
// const Conversation = require('./conversations');
const Auth = require('./Auth.route');
const User = require('./User.route');
// const File = require('./files');
// const Post = require('./posts');
const Role = require('./Roles.route');
// const Comment = require('./comments');
// const Report = require('./reports');
// const Admin = require('./admin');
// const Notification = require('./');
// const Hobby = require('./hobby');
const Search = require('./Search.route');
const Album = require('./Album.route');
const BadWord = require('./Badwork.route');
// const List = require('./list');

const logEvents = require('../Helpers/logEvents');
const bot = require('../utils/SlackLogger/bot');

function route(app) {
	app.use((req, res, next) => {
		const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
		const { origin } = req.headers;
		if (allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		if (req.method === 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
			return res.status(200).json({});
		}
		next();
	});

	app.use('/search', Search);
	app.use('/badwords', BadWord);
	app.use('/albums', Album);
	// app.use('/admin', Admin);
	// app.use('/files', File);
	// app.use('/conversations/:conversationId/messages', Message);
	// app.use('/conversations', Conversation);
	// app.use('/posts/:postId/comments', Comment);
	// app.use('/posts', Post);
	app.use('/users', User);
	app.use('/roles', Role);
	app.use('/auth', Auth);
	// app.use('/notifications', Notification);
	// app.use('/reports', Report);
	// app.use('/hobbies', Hobby);
	// app.use('/list', List);
	app.use((req, next) => {
		next(createError(404, `Method: ${req.method} of ${req.originalUrl}  not found`));
	});
	app.use((error, req, res) => {
		logEvents(`idError: ${uuidv4()} - ${error.message}`);
		bot.sendNotificationToBotty(`Method: ${req.method} of ${req.originalUrl}  not found\n${error.message}`);
		res.status(error.status || 500);
		res.json({
			error: {
				message: error.message,
			},
		});
	});
}

module.exports = route;

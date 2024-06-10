const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');
const Message = require('./Message.route');
const Conversation = require('./Conversation.route');
const Auth = require('./Auth.route');
const User = require('./User.route');
const File = require('./File.route');
const Post = require('./Post.route');
const Role = require('./Roles.route');
const Comment = require('./Comment.route');
const Report = require('./Report.route');
const Admin = require('./Admin.route');
const Notification = require('./Notification.route');
const Hobby = require('./Hobby.route');
const Search = require('./Search.route');
const Album = require('./Album.route');
const BadWord = require('./Badwork.route');
const List = require('./List.route');

// const logEvents = require('../Helpers/logEvents');
// const bot = require('../utils/SlackLogger/bot');

function route(app) {
	app.use((req, res, next) => {
		const allowedOrigins = [
			'http://localhost:3000',
			'http://localhost:8000',
			'http://localhost:4000',
			'https://datn-social-network.xyz/',
		];
		const { origin } = req.headers;
		if (allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
			return res.status(200).json({});
		}
		next();
	});
	// app.get('/api/v1/', (req, res, next) => {
	// 	res.send('USER')
	//   })
	app.use('/api/v1/search', Search);
	app.use('/api/v1/badwords', BadWord);
	app.use('/api/v1/albums', Album);
	app.use('/api/v1/admin', Admin);
	app.use('/api/v1/files', File);
	app.use('/api/v1/conversations/:conversationId/messages', Message);
	app.use('/api/v1/conversations', Conversation);
	app.use('/api/v1/posts/:postId/comments', Comment);
	app.use('/api/v1/posts', Post);
	app.use('/api/v1/users', User);
	app.use('/api/v1/roles', Role);
	app.use('/api/v1/auth', Auth);
	app.use('/api/v1/notifications', Notification);
	app.use('/api/v1/reports', Report);
	app.use('/api/v1/hobbies', Hobby);
	app.use('/api/v1/list', List);



	// app.use((req, res, next)  => {
	// 	next(createError(404, `Method: ${req.method} of ${req.originalUrl}  not found`));
	// });
	// app.use((error, req, res) => {
	// 	logEvents(`idError: ${uuidv4()} - ${error.message}`);
	// 	// bot.sendNotificationToBotty(`Method: ${req.method} of ${req.originalUrl}  not found\n${error.message}`);
	// 	res.status(error.status || 500);
	// 	res.json({
	// 		error: {
	// 			message: error.message,
	// 		},
	// 	});
	// });
}

module.exports = route;

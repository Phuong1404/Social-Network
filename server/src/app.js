const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const fs = require('fs');
const HOSTS = require('./configs/cors');

const app = express();
app.use(
	cors({
		origin: HOSTS,
	})
);
app.use(helmet());
// Logger
if (!fs.existsSync(path.join(__dirname, './logs'))) {
	fs.mkdirSync(path.join(__dirname, './logs'));
}
app.use(
	morgan('combined', {
		stream: fs.createWriteStream(path.join(__dirname, './logs', 'access.log'), { flags: 'a' }),
	})
);
// log in console
app.use(morgan('dev'));

// handle send data
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(
	session({
		secret: 'thesocialapp',
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 60000 * 60 * 24,
		},
	})
);
module.exports = app;

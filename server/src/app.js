const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
const fs = require('fs');
const methodOverride = require('method-override');
const HOSTS = require('./configs/cors');

const app = express();
app.use(
	cors({
		origin: HOSTS,
	})
);
app.use(helmet());

if (!fs.existsSync(path.join(__dirname, './logs'))) {
	fs.mkdirSync(path.join(__dirname, './logs'));
}
app.use(
	morgan('combined', {
		stream: fs.createWriteStream(path.join(__dirname, './logs', 'access.log'), { flags: 'a' }),
	})
);

app.use(morgan('dev'));
const routes = require('./routes/index.route');

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(methodOverride('_method'));
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
require('./configs/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

routes(app);
module.exports = app;

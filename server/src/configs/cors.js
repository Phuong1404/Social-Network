const isProd = require('./env');

const PRODUCTION_HOST = [process.env.HOST_ADMIN, process.env.HOST_CLIENT];

const HOSTS = isProd ? PRODUCTION_HOST : '*';

module.exports = HOSTS;

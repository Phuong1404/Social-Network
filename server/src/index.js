const http = require('http');
require('dotenv').config();

const app = require('./app');
const server = http.createServer(app);


const db = require('./configs/db/index');
db.connectMongoDB();

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
	console.log(`Server is listen on port ${PORT}`);
});

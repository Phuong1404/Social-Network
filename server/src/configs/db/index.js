const mongoose = require('mongoose');
require('dotenv').config();
async function connectMongoDB() {
	try {
		mongoose.set('strictQuery', false);
		mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`Connected to database successfully`);
	} catch (error) {
		console.log(`Connect fail!! ${error.message}`);
	}
}
module.exports = { connectMongoDB };

module.exports = {
	MongooseToObject(mongooes) {
		return mongooes ? mongooes.toObject() : mongooes;
	},
	multipleMongooseToObject(mongooesArray) {
		return mongooesArray.map((mongoes) => mongoes.toObject());
	},
	getPagination: (page, size, offset) => {
		const limit = size ? +size : 5;
		if (offset) {
			return { limit: Number(limit), offset: Number(offset) };
		}
		offset = page ? page * limit : 0;
		return { limit: Number(limit), offset: Number(offset) };
	},
};

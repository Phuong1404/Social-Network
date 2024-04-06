const List = require('../../models/List.model');

async function checkBadWord(content) {
	const listBadWords = await List.findOne({
		key: 'bad-word',
	});
	const bannedWords = listBadWords.items ?? [];
	const lowerCaseContent = content.toLowerCase();

	for (const word of bannedWords) {
		if (lowerCaseContent.includes(word.toLowerCase())) {
			return true;
		}
	}

	return false;
}

module.exports = {
	checkBadWord,
};

import sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';
import queryString from 'query-string';

export const stringUtil = {
	getShortName: (name) => {
		if (!name) return '';
		const nameArr = name.split(' ');
		return nameArr
			.map((n) => n[0])
			.join('')
			.slice(-2);
	},

	renderHTML: (html) => {
		const clean = sanitizeHtml(html);

		return parse(clean);
	},

	normalize: (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),

	search: (str, search, { normalize, ignoreCase }) => {
		if (normalize) {
			str = stringUtil.normalize(str);
			search = stringUtil.normalize(search);
		}

		if (ignoreCase) {
			str = str.toLowerCase();
			search = search.toLowerCase();
		}

		return str.includes(search);
	},

	generateUrl: (url, params) => `${url}?${queryString.stringify(params)}`,

	htmlToPlainText: (html) => {
		const plainText = sanitizeHtml(html, {
			allowedTags: [],
			allowedAttributes: {},
		});

		return plainText;
	},
};

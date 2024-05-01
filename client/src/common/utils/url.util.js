import queryString from 'query-string';

export const urlUtil = {
	getFullUrl: (url) => {
		if (url.startsWith('http')) return url;

		if (url.startsWith('/')) return `${process.env.BASE_URL}${url}`;

		return `${process.env.BASE_URL}/${url}`;
	},

	generateUrl: (url, params) => `${url}?${queryString.stringify(params)}`,

	getPlaceholderImage: ({ width = 0, height = 0, text = '' })=>{}

};

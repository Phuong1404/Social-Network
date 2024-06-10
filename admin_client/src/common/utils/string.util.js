import { isObject } from 'lodash';

export const stringUtil = {
	generateUrl: (url, params) => {
		if (!params) return url;

		const urlParams = new URLSearchParams();

		const append = (key, value) => {
			if (Array.isArray(value)) {
				value.forEach((item) => append(key, item));
				return;
			}

			if (isObject(value)) {
				Object.entries(value).forEach(([k, v]) => append(k, v));
				return;
			}

			value ??= '';
			if (value != '') urlParams.append(key, String(value));
		};

		Object.entries(params).forEach(([key, value]) => append(key, value));

		const queryString = urlParams.toString();
		return [url, queryString].join('?');
	},
};

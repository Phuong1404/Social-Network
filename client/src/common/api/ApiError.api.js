import axios from 'axios';

export class ApiError {
	constructor(code, message = 'Lỗi kết nối đến máy chủ!') {
		this.code = code;
		this.message = message;

		console.error(`[ApiError]: ${this.toString()}`);
	}

	static fromAxiosError(error) {
		const { response } = error;
		if (response?.status) {
			const code = response.status;
			let message = 'Lỗi kết nối đến máy chủ!';

			const { data, statusText } = response;

			if (data) {
				const { error, message: dataMsg } = data;

				if (error) {
					const { message: errorMsg } = error;

					message = errorMsg || error;
				} else message = dataMsg || data;
			} else if (statusText) message = statusText;

			return new ApiError(code, message);
		}

		return new ApiError(500, error.message);
	}

	static fromError(error) {
		if (axios.isAxiosError(error)) return ApiError.fromAxiosError(error);

		return new ApiError(500, error.message);
	}

	static isApiError(error) {
		return !!Number(error?.code) && !!error?.message;
	}

	toString() {
		return `[${this.code}]: ${this.message}`;
	}

	toObject() {
		return { code: this.code, message: this.message };
	}

	static fromObject(obj) {
		if (!ApiError.isApiError(obj)) throw new Error('Invalid ApiError object!');

		return new ApiError(obj.code, obj.message);
	}

	toJSON() {
		return JSON.stringify(this.toObject());
	}

	static fromJSON(json) {
		this.fromObject(JSON.parse(json));
	}
}

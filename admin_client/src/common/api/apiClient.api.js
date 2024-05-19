import axios from 'axios';
import { API_URL, MAX_RETRY } from '@/common/config';
import { handleApiError, retryRequest } from '.';

const isUnauthorized = (error) => axios.isAxiosError(error) && error.response?.status == 401;

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Max-Retry': MAX_RETRY,
		'Retry-Count': 0,
	},
	timeout: 10000,
	timeoutErrorMessage: 'Lỗi kết nối đến máy chủ!',
});

apiClient.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('accessToken');

		if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

		return config;
	},
	(error) => handleApiError(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (isUnauthorized(error)) return retryRequest(error);

		return handleApiError(error);
	}
);

export { apiClient };

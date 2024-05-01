import axios from 'axios';
import { SERVER_URL } from '@/common/config';
import { ApiError } from './ApiError.api';

const isUnauthorized = (error) => axios.isAxiosError(error) && error.response?.status === 401;


export const handleError = (error) => {
	if (ApiError.isApiError(error)) return Promise.reject(error);

	return Promise.reject(ApiError.fromError(error));
};

const MAX_RETRY = 3;
const excludeUrls = ['/auth/login', '/auth/register', '/auth/refresh'];

const retryRequest = async (error) => {

	const retryConfig = error.config;


	if (excludeUrls.includes(retryConfig.url)) return handleError(error);


	const retryCount = Number(retryConfig.headers['Retry-Count']);
	const maxRetry = Number(retryConfig.headers['Max-Retry']);
	if (retryCount >= maxRetry) {

		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		return handleError(error);
	}


	retryConfig.headers['Retry-Count'] = retryCount + 1;


	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) return handleError(error);


	const { data } = await apiClient.post('/auth/refresh', { refreshToken });


	localStorage.setItem('accessToken', data.accessToken);


	retryConfig.headers.Authorization = `Bearer ${data.accessToken}`;


	return apiClient.request(retryConfig);
};


const apiClient = axios.create({
	baseURL: SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
		'Max-Retry': MAX_RETRY,
		'Retry-Count': 0,
	},
	timeout: 20000,
	timeoutErrorMessage: 'Lỗi kết nối đến máy chủ!',
});


apiClient.interceptors.request.use((config) => {
	try {

		const accessToken = localStorage.getItem('accessToken');


		if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
	} catch (error) {

		console.error('Get access token error: ', error);
	}

	return config;
}, handleError);


apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {

		if (isUnauthorized(error)) return retryRequest(error);

		return handleError(error);
	}
);

export function swrFetcher(url) {
	return apiClient
		.get(url)
		.then((res) => res.data)
		.catch(handleError);
}

export { apiClient };

import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient, handleApiError, refreshAccessToken } from '.';

const excludeUrls = ['/admin/login', '/admin/refresh'];

const retryRequest = async (error) => {
	const retryConfig = error.config;

	if (excludeUrls.includes(retryConfig.url)) return handleApiError(error);

	const retryCount = Number(retryConfig.headers['Retry-Count']);
	const maxRetry = Number(retryConfig.headers['Max-Retry']);
	if (retryCount >= maxRetry) return handleApiError(error);

	retryConfig.headers['Retry-Count'] = retryCount + 1;

	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) return handleApiError(error);

	try {
		const accessToken = await refreshAccessToken();

		retryConfig.headers.Authorization = `Bearer ${accessToken}`;

		return apiClient.request(retryConfig);
	} catch (error) {
		return handleApiError(error);
	}
};

export { retryRequest };

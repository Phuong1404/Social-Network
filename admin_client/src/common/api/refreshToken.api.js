import { apiClient } from '.';

const refreshAccessToken = async () => {
	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) throw new Error('Không tìm thấy refresh token!');

	const {
		data: { accessToken },
	} = await apiClient.post<{ accessToken }>('/admin/refresh', { refreshToken });

	localStorage.setItem('accessToken', accessToken);

	return accessToken;
};

export { refreshAccessToken };

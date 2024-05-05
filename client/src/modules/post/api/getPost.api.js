import { apiClient, apiServer } from '@/common/api';

export const getPostApi = (id, serverSide = false) => {
	if (serverSide) {
		return apiServer.get(`/posts/${id}`).then((res) => res.data);
	}

	return apiClient.get(`/posts/${id}`).then((res) => res.data);
};

import { apiClient } from '@/common/api';

export const updatePostApi = (id, data) =>
	apiClient.put(`/posts/${id}`, data).then((res) => res.data);

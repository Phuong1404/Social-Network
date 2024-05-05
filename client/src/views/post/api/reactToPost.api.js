import { apiClient } from '@/common/api';

export const reactToPostApi = (id, reaction) =>
	apiClient.put(`/posts/${id}/react`, { type: reaction }).then((res) => res.data);

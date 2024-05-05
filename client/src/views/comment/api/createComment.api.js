import { apiClient } from '@/common/api';

export const createCommentApi = (postId, data) =>
	apiClient.post(`posts/${postId}/comments`, data).then((res) => res.data);

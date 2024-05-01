import { apiClient } from '@/common/api';

export const getCommentApi = (postId) =>
	apiClient.get(`posts/${postId}/comments`).then((res) => res.data);

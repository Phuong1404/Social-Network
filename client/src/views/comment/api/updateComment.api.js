import { apiClient } from '@/common/api';

export const updateCommentApi = (postId, commentId, data) =>
	apiClient.put(`posts/${postId}/comments/${commentId}`, data).then((res) => res.data);

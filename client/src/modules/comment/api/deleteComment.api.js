import { apiClient } from '@/common/api';

export const deleteCommentApi = (postId, commentId) =>
	apiClient.delete(`posts/${postId}/comments/${commentId}`).then((res) => res.data);

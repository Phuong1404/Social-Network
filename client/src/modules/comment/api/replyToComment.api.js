import { apiClient } from '@/common/api';

export const replyToCommentApi = (postId, commentId, data) =>
	apiClient.post(`posts/${postId}/comments/${commentId}/reply`, data).then((res) => res.data);

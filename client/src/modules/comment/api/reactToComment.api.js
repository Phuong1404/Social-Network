import { apiClient } from '@/common/api';

export const reactToCommentApi = (postId, commentId, reaction) =>
	apiClient
		.put(`posts/${postId}/comments/${commentId}/react`, { type: reaction })
		.then((res) => res.data);

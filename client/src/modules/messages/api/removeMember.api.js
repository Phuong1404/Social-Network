import { apiClient } from '@/common/api';

export const removeMemberApi = ({ conversationId, userID }) =>
	apiClient
		.patch(`/conversations/${conversationId}/members/remove`, {
			userID,
		})
		.then((res) => res.data);

import { apiClient } from '@/common/api';

export const changeRoleApi = ({ conversationId, userID, role }) =>
	apiClient
		.patch(`/conversations/${conversationId}/members/changeRole`, {
			userID,
			role,
		})
		.then((res) => res.data);

import { apiClient } from '@/common/api';

export const addMemberApi = ({ conversationId, members }) =>
	apiClient
		.patch(`/conversations/${conversationId}/members/add`, {
			newMembers: members.map((id) => ({ user: id })),
		})
		.then((res) => res.data);

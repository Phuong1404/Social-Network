import { apiClient } from '@/common/api';

export const changeNicknameApi = ({ conversationId, userID, nickname }) =>
	apiClient
		.patch(`/conversations/${conversationId}/members/changeNickname`, {
			userID,
			nickname,
		})
		.then((res) => res.data);

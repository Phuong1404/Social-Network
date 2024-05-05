import { apiClient } from '@/common/api';

export const updateConversationApi = async (id, data) =>
	apiClient.put(`conversations/${id}`, data).then((res) => res.data);

import { apiClient } from '@/common/api';

export const createConversationApi = async (data) =>
	apiClient.post('/conversations', data).then((res) => res.data);

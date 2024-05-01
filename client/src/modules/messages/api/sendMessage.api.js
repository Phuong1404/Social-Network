import { apiClient } from '@/common/api';

export const sendMessageApi = (convId, data) =>
	apiClient.post(`conversations/${convId}/messages`, data).then((res) => res.data);

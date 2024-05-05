import { apiClient } from '@/common/api';

export const leaveConversationApi = (id) => apiClient.put(`conversations/${id}/leave`).then((res) => res.data);

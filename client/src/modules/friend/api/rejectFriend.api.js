import { apiClient } from '@/common/api';

export const rejectFriendApi = (userId) => apiClient.put(`users/${userId}/reject-request`);

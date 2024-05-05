import { apiClient } from '@/common/api';

export const requestFriendApi = (userId) => apiClient.put(`users/${userId}/friend-request`);

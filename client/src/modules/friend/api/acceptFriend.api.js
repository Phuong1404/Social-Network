import { apiClient } from '@/common/api';

export const acceptFriendApi = (userId) => apiClient.put(`users/${userId}/accept-friend`);

import { apiClient } from '@/common/api';

export const unFriendApi = (userId) => apiClient.put(`users/${userId}/unfriend`);

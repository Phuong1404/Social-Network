import { apiClient } from '@/common/api';

export const deleteActivityApi = async (id) => apiClient.delete(`/users/activities/${id}`);

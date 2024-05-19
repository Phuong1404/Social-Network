import { apiClient } from '@/common/api';

export const getProfileApi = () => apiClient.get('/users/profile').then((res) => res.data);

import { apiClient } from '@/common/api';

export const loginTokenApi = () => apiClient.get('/users/profile').then((res) => res.data);

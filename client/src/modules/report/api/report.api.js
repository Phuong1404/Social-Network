import { apiClient } from '@/common/api';

export const reportApi = (data) => apiClient.post('/reports', data).then((res) => res.data);

import { apiClient } from '@/common/api';

export const createAdminApi = (admin) => apiClient.post('/admin/createAccount', admin).then((res) => res.data);

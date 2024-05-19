import { apiClient } from '@/common/api';

export const unlockUserApi = (id) => apiClient.put(`/admin/unlockUser/${id}`).then((res) => res.data);

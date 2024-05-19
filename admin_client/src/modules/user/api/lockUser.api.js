import { apiClient } from '@/common/api';

export const lockUserApi = (id, reason) =>
	apiClient.put(`/admin/lockUser/${id}`, { reasonLock: reason }).then((res) => res.data);

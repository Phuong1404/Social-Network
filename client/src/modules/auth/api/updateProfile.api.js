import { apiClient } from '@/common/api';

export const updateProfileApi = (data) =>
	apiClient.put(`users/update-profile`, data).then((res) => res.data);

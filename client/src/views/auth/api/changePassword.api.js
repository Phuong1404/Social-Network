import { apiClient } from '@/common/api';
export const changePasswordApi = (data) =>
	apiClient.put('/auth/change-password', data).then((res) => res.data);

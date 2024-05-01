import { apiClient } from '@/common/api';

export const setPasswordApi = (data) =>
	apiClient.put('/auth/set-password', data).then((res) => res.data);

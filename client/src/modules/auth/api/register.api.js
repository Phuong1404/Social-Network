import { apiClient } from '@/common/api';

export const registerApi = (data) =>
	apiClient.post('/auth/register', data).then((res) => res.data);

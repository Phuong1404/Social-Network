import { apiClient } from '@/common/api';

export const loginApi = ({ email, password }) =>
	apiClient.post('/auth/login', { email, password }).then((res) => res.data);

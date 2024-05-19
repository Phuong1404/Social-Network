import { apiClient } from '@/common/api';

export const loginApi = ({ email, password }) =>
	apiClient.post('/admin/login', { email, password }).then((res) => res.data);

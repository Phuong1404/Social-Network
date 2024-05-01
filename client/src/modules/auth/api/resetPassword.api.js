import { apiClient } from '@/common/api';
export const resetPasswordApi = ({ id, password, token }) =>
	apiClient.post(`/auth/password-reset/${id}/${token}`, { password }).then((res) => res.data);

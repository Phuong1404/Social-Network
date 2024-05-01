import { apiClient } from '@/common/api';

export const sendOtpRegisterApi = (data) =>
	apiClient.post('/auth/otp/register', data).then((res) => res.data);

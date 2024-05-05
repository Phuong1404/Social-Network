import { apiClient } from '@/common/api';

export const readNotificationApi = (id) => apiClient.put(`notifications/read/${id}`).then((res) => res.data);

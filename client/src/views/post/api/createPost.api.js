import { apiClient } from '@/common/api';

export const createPostApi = (data) => apiClient.post('/posts', data).then((res) => res.data);

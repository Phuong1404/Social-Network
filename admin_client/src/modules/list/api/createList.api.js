import { apiClient } from '@/common/api';

export const createListApi = (list) => apiClient.post('/list', list).then((res) => res.data);

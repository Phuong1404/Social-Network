import { apiClient } from '@/common/api';

export const deleteListApi = (id) => apiClient.delete(`/list/${id}`).then((res) => res.data);

import { apiClient } from '@/common/api';

export const deletePostApi = (id) => apiClient.delete(`/posts/${id}`).then((res) => res.data);

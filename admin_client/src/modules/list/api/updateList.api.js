import { apiClient } from '@/common/api';

export const updateListApi = (id, list) =>
	apiClient.put(`/list/${id}`, list).then((res) => res.data);

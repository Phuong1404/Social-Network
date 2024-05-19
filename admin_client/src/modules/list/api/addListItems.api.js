import { apiClient } from '@/common/api';

export const addListItemsApi = (id, items) =>
	apiClient.patch(`/list/${id}/items/add`, { items }).then((res) => res.data);

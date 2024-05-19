import { apiClient } from '@/common/api';

export const removeListItemsApi = (id, items) =>
	apiClient.patch(`/list/${id}/items/remove`, { items }).then((res) => res.data);

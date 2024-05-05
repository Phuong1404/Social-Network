import { apiClient } from '@/common/api';

export const updateAlbumApi = (id, data) =>
	apiClient.put(`/albums/${id}`, data).then((res) => res.data);

import { apiClient } from '@/common/api';

export const createAlbumApi = (data) =>
	apiClient.post('/albums', data).then((res) => res.data);

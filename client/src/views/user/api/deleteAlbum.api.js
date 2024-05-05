import { apiClient } from '@/common/api';

export const deleteAlbumApi = async (id) => apiClient.delete(`/albums/${id}`);

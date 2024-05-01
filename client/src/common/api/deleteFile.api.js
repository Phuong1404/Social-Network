import { apiClient } from "./apiClient.api";

export const deleteFileApi = (id) => apiClient.delete(`files/${id}`).then((res) => res.data);

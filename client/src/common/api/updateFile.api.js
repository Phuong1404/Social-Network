import { apiClient } from "./apiClient.api";

export const updateFileApi = (id, data) =>
	apiClient.put(`files/${id}`, data).then((res) => res.data);

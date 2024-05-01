import { apiClient } from "./apiClient.api";

export const getImageFileApi = (id, options = {}) =>
	apiClient
		.get(`files/${id}`, {
			params: options,
		})
		.then((res) => res.data);

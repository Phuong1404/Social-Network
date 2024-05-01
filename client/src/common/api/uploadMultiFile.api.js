import { apiClient } from "./apiClient.api";


export const uploadMultiFileApi = (files, data = {}) => {
	const formData = new FormData();


	for (let i = 0; i < files.length; i++) {
		formData.append('files', files[i]);
	}


	for (const key in data) {
		if (data[key] !== undefined) {
			formData.append(key, data[key]);
		}
	}

	return apiClient
		.post('files/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);
};

export const uploadFileApi = (file, data = {}) => {
	const formData = new FormData();


	formData.append('file', file);


	for (const key in data) {
		if (data[key] != null) formData.append(key, data[key]);
	}

	return apiClient
		.post('files', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);
};

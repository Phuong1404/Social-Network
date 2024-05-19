import { apiClient } from '.';

const swrFetcher = (url, config) => apiClient.get(url, config).then((res) => res.data);

export { swrFetcher };

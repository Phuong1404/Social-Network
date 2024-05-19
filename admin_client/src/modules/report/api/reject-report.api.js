import { apiClient } from '@/common/api';

export const rejectReportApi = (reportId) => apiClient.put(`/reports/${reportId}/reject`);

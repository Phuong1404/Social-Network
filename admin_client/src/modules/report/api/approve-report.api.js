import { apiClient } from '@/common/api';

export const approveReportApi = (reportId) => apiClient.put(`/reports/${reportId}/approve`);

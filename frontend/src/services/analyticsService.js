import api from './api';

export async function getSummary() {
  const { data } = await api.get('/api/analytics/summary');
  return data;
}

export async function getAdminMetrics() {
  const { data } = await api.get('/api/analytics/admin/user-metrics');
  return data;
}

import api from './api';

export async function analyzeMood(frameBase64) {
  const { data } = await api.post('/api/analyze-mood', { frame_base64: frameBase64 });
  return data;
}

export async function analyzeMoodDebug(frameBase64) {
  const { data } = await api.post('/api/analyze-mood-debug', { frame_base64: frameBase64 });
  return data;
}

export async function saveMood(payload) {
  const { data } = await api.post('/api/save-mood', payload);
  return data;
}

export async function getHistory(limit = 50) {
  const { data } = await api.get(`/api/get-history?limit=${limit}`);
  return data;
}

export async function getRecommendations() {
  const { data } = await api.get('/api/recommend');
  return data;
}

export async function getAnalytics() {
  const { data } = await api.get('/api/analytics/summary');
  return data;
}

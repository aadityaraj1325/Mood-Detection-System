import api from './api';

export async function getRecommendations() {
  const { data } = await api.get('/api/recommend');
  return data;
}

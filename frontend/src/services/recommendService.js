import api from './api';

export async function getRecommendations() {
  const { data } = await api.get('/recommend');
  return data;
}

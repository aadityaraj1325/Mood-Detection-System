import api from './api';

export const getGameHistory = async () => {
  const response = await api.get('/games/history');
  return response.data;
};

import api from './api.js';

export const saveJournal = async (content) => {
  const response = await api.post('/journal/save', { content });
  return response.data;
};

export const getJournalHistory = async () => {
  const response = await api.get('/journal/history');
  return response.data;
};

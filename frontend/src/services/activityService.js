import api from './api';

export const saveActivity = async (activityData) => {
  const response = await api.post('/activity/save', activityData);
  return response.data;
};

export const getActivityHistory = async () => {
  const response = await api.get('/activity/history');
  return response.data;
};

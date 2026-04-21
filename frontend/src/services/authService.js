import api from './api';

export async function registerUser(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get('/api/auth/me');
  return data;
}

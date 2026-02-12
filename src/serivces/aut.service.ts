import getApi from '@/api/client';

export const login = async (email: string, password: string) => {

  const api = getApi();

  const response = await api.post('/login', { email, password });

  const token = response.data.token;
  localStorage.setItem('token', token);

  return response;
};

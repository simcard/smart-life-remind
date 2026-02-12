import getApi from '@/api/client';
import { User } from '@/models/user';

export const login = async (email: string, password: string) => {

  const api = getApi();

  const response = await api.post('/login', { email, password });

  const token = response.data.token;
  localStorage.setItem('token', token);

  return response;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/auth';
};


export const singUp = async (singUpRequest: User) => {

  const api = getApi();
  const response = await api.post('/users', {
    email: singUpRequest.email,
    full_name: singUpRequest.full_name,
    avatar_url: singUpRequest.avatar_url,
    password: singUpRequest.password,
    plan_type: singUpRequest.plan_type
  });
  return response.data;
};
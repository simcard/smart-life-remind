import axios from 'axios';

const getApi = () => {
  const token = localStorage.getItem('token'); 

  return axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export default getApi;

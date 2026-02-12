import axios from 'axios';

const getApi = () => {
  const token = localStorage.getItem('token'); 

  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export default getApi;

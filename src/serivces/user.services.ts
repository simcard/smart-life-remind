import getApi from '@/api/client';

export const getFamilyMembers = async () => {

  const api = getApi();

  const response = await api.get('/family');

  return response.data
};
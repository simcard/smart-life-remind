import getApi from '@/api/client';

export const getNotifications = async () => {
  const api = getApi();
  const response = await api.get('/notifications');
  return response.data;
};

export const addNotification = async (notificationData: { title: string; message: string }) => {
  const api = getApi();
  const response = await api.post('/notification-preferences', notificationData);
  return response.data;
}
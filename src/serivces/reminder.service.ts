import getApi from '@/api/client';
import { ReminderRequest } from '@/models/reminder';

export const addReminder = async (reminderData: ReminderRequest) => {
  const api = getApi();
  const response = await api.post('/reminders', reminderData);
  return response.data;
};

export const getReminders = async () => {
  const api = getApi();
  const response = await api.get('/reminders');

  return response.data;
}
export const deleteReminder = async (reminderId: string) => {
  const api = getApi();
  const response = await api.delete(`/reminders/${reminderId}`);
  return response.data;
};

export const updateReminder = async (reminderId: string, reminderData: ReminderRequest) => {
  const api = getApi();
  const response = await api.put(`/reminders/${reminderId}`, reminderData);
  return response.data;
}
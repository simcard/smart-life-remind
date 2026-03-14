import { ReminderRequest, Reminder } from "@/models/reminder";
import { addReminder, deleteReminder, getReminders, updateReminder } from "@/serivces/reminder.service";
import { create } from "zustand";

interface ReminderState {
  addReminder: (reminderData: ReminderRequest) => Promise<void>;
  getReminders: () => Promise<void>;
  isLoading: boolean;
  reminders: Reminder[]; 
  updateReminder: (reminderId: string, reminderData: ReminderRequest) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;
}

export const useReminderStore = create<ReminderState>((set) => ({
  isLoading: false,
  reminders: [],

  addReminder: async (reminderData: ReminderRequest) => {
    try {
      set({ isLoading: true });
      await addReminder(reminderData);
    } catch (error) {
      console.error("Failed to add reminder:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getReminders: async () => {
    try {
      set({ isLoading: true });
      const response = await getReminders();
      console.log("Fetched reminders:", response);
      if(!response) {
        set({ reminders: [] });
        return;
      }
      set({ reminders: response.reminders || [] });
    } catch (error) {
      console.error("Failed to get reminders:", error);
      set({ reminders: [] });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  updateReminder: async (reminderId: string, reminderData: ReminderRequest) => {
    try {
      set({ isLoading: true });
      const response = await updateReminder(reminderId, reminderData);
      if(response && response.id) {
        await getReminders(); // Refresh the reminders list after update
      }
    } catch (error) {
      console.error("Failed to update reminder:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteReminder: async (reminderId: string) => {
    try {
      set({ isLoading: true });
      await deleteReminder(reminderId);
    } catch (error) {
      console.error("Failed to delete reminder:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
import { familyMember, User } from "@/models/user";
import { getFamilyMembers } from "@/serivces/user.services";
import { create } from "zustand";

interface UserState {
  user: User | null;
  getFamilyMembers: () => Promise<void>;
  familyMembers: familyMember[] | [];
  isLoading: boolean;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  familyMembers: [],
  isLoading: false,
  getFamilyMembers: async () => {
    try {
      set({ isLoading: true });
      const response = await getFamilyMembers();
      set({ familyMembers: response, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error("Failed to fetch family members:", error);
    }
  }
 }));
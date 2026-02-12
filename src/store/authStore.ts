import { login } from "@/serivces/aut.service";
import { create } from "zustand";


interface User{
  id: string;
  email: string;
  full_name: string;
  plan_type: 'family' | 'business';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (email: string, password: string) => { 
    try {           
    set({ isLoading: true });
    const response = await login(email, password );

    const user = response.data.user;
    set({ user, isAuthenticated: true, isLoading: false });
    
    return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));
import { User } from "@/models/user";
import { login, singUp } from "@/serivces/aut.service";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signUp: (singUpRequest: User) => Promise<User>;
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
  },
  signUp: async (singUpRequest: User) => {
    try {
      set({ isLoading: true });
      await singUp(singUpRequest);
      const response =await login(singUpRequest.email, singUpRequest.password!);
      const user = response.data.user;
      set({ user, isAuthenticated: true, isLoading: false });
      return user;  
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }

}));
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
};

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const userStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
          }),
        clearUser: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => AsyncStorage), // 👈 very clean way
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

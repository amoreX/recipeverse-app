import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: String;
  email: String;
  name?: string;
  avatar_url?: string;
  bio?: string;
};

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setHasHydrated: (hydrated: boolean) => void;
};

const zustandStorage = {
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value;
  },
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};

export const userStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        hasHydrated: false,
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
        setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      }),
      {
        name: 'user-storage',
        storage: AsyncStorage, // <-- Tell zustand to use AsyncStorage
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (!error) {
            state?.setHasHydrated(true);
          }
        },
      }
    )
  )
);

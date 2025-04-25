import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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

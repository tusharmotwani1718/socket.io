import { create } from 'zustand';

interface UserState {
    user: string | null;
    setUser: (user: string) => void;
}


export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: string) => set({ user }),
}));
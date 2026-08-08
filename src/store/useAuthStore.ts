import { create } from 'zustand';

type Role = 'student' | 'admin';

interface User {
    id: string;
    name: string;
    role: Role;
}

interface AuthState {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null, // default saat belum login
  
    // dummy untuk mock login selama backend belum ada
    login: (userData) => set({ user: userData }),
    logout: () => set({ user: null }),
  
    // helper function agar lebih mudah dicek di komponen
    isAdmin: () => get().user?.role === 'admin',
}));
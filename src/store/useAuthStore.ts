import { create } from 'zustand';
import { userApi } from '@/lib/api';

export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  coins: number;
  streak_count: number;
  photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (userData: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
  
  // API Actions
  registerUser: (userData: { name: string; email: string; password: string; role?: Role }) => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  fetchUserProfile: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = 'auralearn_user';

const getInitialUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to parse saved user:', e);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  isLoading: false,
  error: null,

  login: (userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
    set({ user: userData, error: null });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('user_id');
      localStorage.removeItem('userId');
      // Clean up all local session progress and roadmap keys
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith('module_session_') || k.startsWith('auralearn_active_roadmap')) {
            localStorage.removeItem(k);
          }
        });
      } catch {}
    }
    set({ user: null, error: null });
  },

  isAdmin: () => get().user?.role === 'admin',

  clearError: () => set({ error: null }),

  registerUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const createdUser = await userApi.createUser(userData);
      const user: User = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role || 'student',
        coins: createdUser.coins || 0,
        streak_count: createdUser.streak_count || 0,
        photo_url: createdUser.photo_url || null,
        created_at: createdUser.created_at,
      };
      get().login(user);
      set({ isLoading: false });
      return user;
    } catch (err: any) {
      const message = err.message || 'Registration failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  loginWithEmail: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Find matching user from GET /api/users
      const users: User[] = await userApi.getUsers();
      const matched = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matched) {
        throw new Error('Email not found. Please register first.');
      }

      // Fetch full profile by ID
      const fullProfile = await userApi.getUserById(matched.id);
      get().login(fullProfile);
      set({ isLoading: false });
      return fullProfile;
    } catch (err: any) {
      const message = err.message || 'Login failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchUserProfile: async (userId) => {
    if (!userId) return;
    set({ isLoading: true });
    try {
      const user = await userApi.getUserById(userId);
      get().login(user);
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserRole: async (userId, role) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await userApi.updateUser(userId, { role });
      get().login(updated);
    } catch (err: any) {
      set({ error: err.message || 'Failed to update role' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (userId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await userApi.updateUser(userId, updates);
      get().login(updated);
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
import { create } from "zustand";

interface UIState {
  // --- Sidebar Mobile State ---
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  openMobileSidebar: () => void;

  // --- Focus Mode State  ---
  isFocusMode: boolean;
  enableFocusMode: () => void;
  disableFocusMode: () => void;
  toggleFocusMode: () => void;
}

// Inisialisasi Zustand Store
export const useUIStore = create<UIState>((set) => ({
  // Default State
  isMobileSidebarOpen: false,
  isFocusMode: false,

  // --- Aksi untuk Sidebar ---
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  
  closeMobileSidebar: () => 
    set({ isMobileSidebarOpen: false }),
  
  openMobileSidebar: () => 
    set({ isMobileSidebarOpen: true }),

  // --- Focus Mode ---
  enableFocusMode: () => 
    set({ isFocusMode: true }),
  
  disableFocusMode: () => 
    set({ isFocusMode: false }),
  
  toggleFocusMode: () =>
    set((state) => ({ isFocusMode: !state.isFocusMode })),
}));
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccountRole = "customer" | "vendor";
export type SessionUser = { name: string; email: string; phone?: string; role: AccountRole; storeName?: string };
type AuthState = {
  /** Profile of the signed-in person. The real session is the backend's login cookie; this is only for display. */
  user: SessionUser | null;
  hydrated: boolean;
  signIn: (user: SessionUser) => void;
  clearSession: () => void;
  setHydrated: () => void;
};

export const useAuth = create<AuthState>()(persist((set) => ({
  user: null,
  hydrated: false,
  signIn: (user) => set({ user }),
  clearSession: () => set({ user: null }),
  setHydrated: () => set({ hydrated: true }),
}), {
  name: "aura-session",
  partialize: (s) => ({ user: s.user }),
  onRehydrateStorage: () => (state) => { state?.setHydrated(); },
}));

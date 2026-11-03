"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccountRole = "customer" | "vendor";
export type SessionUser = { name: string; email: string; phone?: string; role: AccountRole; storeName?: string };
type AuthState = {
  user: SessionUser | null;
  vendorRegistered: boolean;
  hydrated: boolean;
  signIn: (user: SessionUser) => void;
  signUp: (user: SessionUser) => void;
  signOut: () => void;
  setHydrated: () => void;
};

export const useAuth = create<AuthState>()(persist((set) => ({
  user: null,
  vendorRegistered: false,
  hydrated: false,
  signIn: (user) => set({ user }),
  signUp: (user) => set((state) => ({ user, vendorRegistered: state.vendorRegistered || user.role === "vendor" })),
  signOut: () => set({ user: null }),
  setHydrated: () => set({ hydrated: true }),
}), {
  name: "aura-auth",
  partialize: (s) => ({ user: s.user, vendorRegistered: s.vendorRegistered }),
  onRehydrateStorage: () => (state) => { state?.setHydrated(); },
}));

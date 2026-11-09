"use client";

import { logout } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

/** Sign out for real: ask the backend to drop the cookie, then clear local state. */
export async function endSession() {
  const role = useAuth.getState().user?.role;
  await logout(role === "vendor");
  useAuth.getState().clearSession();
  useCart.getState().reset();
}

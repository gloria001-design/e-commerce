"use client";

import { useEffect } from "react";
import { setUnauthorizedHandler } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

/** Keeps the app in step with the cookie session. Mounted once in the root layout. */
export function SessionSync() {
  const hydrated = useAuth((s) => s.hydrated);
  const role = useAuth((s) => s.user?.role);
  const email = useAuth((s) => s.user?.email);

  // Any 401 from the backend means the cookie is gone or expired: drop the local profile.
  useEffect(() => {
    setUnauthorizedHandler(() => { useAuth.getState().clearSession(); useCart.getState().reset(); });
    return () => setUnauthorizedHandler(null);
  }, []);

  // Customers get their server-side cart loaded as soon as the session is known.
  useEffect(() => {
    if (!hydrated) return;
    if (role === "customer") void useCart.getState().load(); else useCart.getState().reset();
  }, [hydrated, role, email]);

  return null;
}

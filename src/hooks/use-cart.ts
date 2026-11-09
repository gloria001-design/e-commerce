"use client";

import { create } from "zustand";
import { addToCart, getCart, productToCatalog, removeCartItem, updateCartItem, type ApiError, type CartResponse } from "@/lib/api";
import type { CartLine, Product } from "@/types/catalog";

/** The cart lives on the backend (tied to the login cookie). This store is a mirror of it. */
type CartState = {
  lines: CartLine[];
  loaded: boolean;
  loading: boolean;
  error: string;
  load: () => Promise<void>;
  add: (product: Product, qty?: number) => Promise<boolean>;
  setQty: (itemId: string, qty: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  reset: () => void;
};

const fromServer = (res: CartResponse | null): CartLine[] =>
  (res?.items ?? []).map((i) => ({ itemId: i.id, qty: i.quantity, product: productToCatalog(i.product) }));
const messageOf = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");
const isUnauthorized = (e: unknown) => (e as ApiError)?.status === 401;

export const useCart = create<CartState>()((set, get) => ({
  lines: [],
  loaded: false,
  loading: false,
  error: "",
  load: async () => {
    set({ loading: true });
    try {
      const res = await getCart();
      set({ lines: fromServer(res), loaded: true, error: "" });
    } catch (e) {
      set({ loaded: true, error: isUnauthorized(e) ? "" : messageOf(e) });
    } finally {
      set({ loading: false });
    }
  },
  add: async (product, qty = 1) => {
    try {
      await addToCart(product.id, qty);
      await get().load();
      return true;
    } catch (e) {
      set({ error: messageOf(e) });
      return false;
    }
  },
  setQty: async (itemId, qty) => {
    if (qty <= 0) return get().remove(itemId);
    set((s) => ({ lines: s.lines.map((l) => (l.itemId === itemId ? { ...l, qty } : l)) }));
    try { await updateCartItem(itemId, qty); } catch (e) { await get().load(); set({ error: messageOf(e) }); }
  },
  remove: async (itemId) => {
    set((s) => ({ lines: s.lines.filter((l) => l.itemId !== itemId) }));
    try { await removeCartItem(itemId); } catch (e) { await get().load(); set({ error: messageOf(e) }); }
  },
  // The backend has no "clear cart" endpoint, so remove every item.
  clear: async () => {
    const ids = get().lines.map((l) => l.itemId);
    set({ lines: [] });
    try { await Promise.all(ids.map((id) => removeCartItem(id))); } catch (e) { await get().load(); set({ error: messageOf(e) }); }
  },
  reset: () => set({ lines: [], loaded: false, loading: false, error: "" }),
}));

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0);
export const selectSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.qty * l.product.price, 0);

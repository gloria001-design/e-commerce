"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/types/catalog";

export type PlacedOrder = {
  id: string;
  placedAt: string;
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  promo?: string | null;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
};

type CartState = {
  lines: CartLine[];
  lastOrder: PlacedOrder | null;
  add: (product: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  placeOrder: (order: Omit<PlacedOrder, "id" | "placedAt" | "lines"> & { lines?: CartLine[] }) => PlacedOrder;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      lastOrder: null,
      add: (product, qty = 1) =>
        set((s) => {
          const hit = s.lines.find((l) => l.product.id === product.id);
          return {
            lines: hit
              ? s.lines.map((l) => (l.product.id === product.id ? { ...l, qty: l.qty + qty } : l))
              : [...s.lines, { product, qty }],
          };
        }),
      setQty: (id, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.product.id !== id) : s.lines.map((l) => (l.product.id === id ? { ...l, qty } : l)),
        })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.product.id !== id) })),
      clear: () => set({ lines: [] }),
      placeOrder: (payload) => {
        const lines = payload.lines ?? get().lines;
        const order: PlacedOrder = {
          id: `AURA-${Math.floor(100000 + Math.random() * 900000)}`,
          placedAt: new Date().toISOString(),
          lines,
          subtotal: payload.subtotal,
          shipping: payload.shipping,
          tax: payload.tax,
          discount: payload.discount,
          total: payload.total,
          promo: payload.promo,
          shippingAddress: payload.shippingAddress,
        };
        set({ lastOrder: order, lines: [] });
        return order;
      },
    }),
    { name: "aura-cart" },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0);
export const selectSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.qty * l.product.price, 0);

"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { selectCount, selectSubtotal, useCart } from "@/hooks/use-cart";
import { money } from "@/lib/catalog";

/** Sticky summary above the bottom nav. Phones only. */
export function CartBar() {
  const count = useCart(selectCount);
  const subtotal = useCart(selectSubtotal);
  if (!count) return null;
  return (
    <div className="fixed inset-x-3 bottom-[76px] z-30 flex items-center gap-3 rounded-2xl bg-ink p-2.5 pl-3 text-canvas shadow-lg md:hidden">
      <span className="relative grid size-9 place-items-center rounded-xl bg-white/10">
        <ShoppingBag className="size-5" />
      </span>
      <p className="flex-1 text-xs leading-tight">
        {count} {count === 1 ? "item" : "items"} in cart
        <span className="block text-sm font-bold">{money(subtotal)} total</span>
      </p>
      <Link href="/cart" className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-ink">
        View Cart <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

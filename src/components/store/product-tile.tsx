"use client";

import { Check, Heart, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Thumb } from "@/components/shared/thumb";
import { useCart } from "@/hooks/use-cart";
import { money } from "@/lib/catalog";
import { addToCart } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@/types/catalog";

export function ProductTile({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const user = useAuth((s) => s.user);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <article className="flex min-w-0 flex-col rounded-[20px] border border-line/50 bg-panel p-2.5 transition-shadow hover:shadow-md sm:p-3">
      <div className="relative">
        <Thumb product={product} className="aspect-square rounded-2xl" />
        {product.badge && <span className="absolute left-2 top-2 rounded-full bg-panel/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">{product.badge}</span>}
        <button onClick={() => setLiked(!liked)} aria-pressed={liked} aria-label="Save to wishlist" className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-panel/95">
          <Heart className={`size-4 ${liked ? "fill-bad text-bad" : ""}`} />
        </button>
      </div>
      <p className="mt-3 flex items-center gap-1 text-xs text-ink-muted">
        <Star className="size-3.5 fill-[#f5a524] text-[#f5a524]" /> {product.rating} ({product.reviews})
      </p>
      <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 sm:text-[15px]">{product.name}</h3>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p>
          <span className="block text-lg font-bold">{money(product.price).replace(".00", "")}</span>
          {product.oldPrice && <span className="text-xs text-ink-muted line-through">{money(product.oldPrice).replace(".00", "")}</span>}
        </p>
        <button
          onClick={async () => { add(product); if (user?.role === "customer" && !product.id.startsWith("p")) { try { await addToCart(product.id); } catch {} } setAdded(true); setTimeout(() => setAdded(false), 1200); }}
          aria-label={`Add ${product.name} to cart`}
          className="grid size-10 place-items-center rounded-full bg-brand text-brand-ink transition-transform active:scale-95"
        >
          {added ? <Check className="size-5" /> : <Plus className="size-5" />}
        </button>
      </div>
    </article>
  );
}

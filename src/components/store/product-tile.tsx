"use client";

import { Check, Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Thumb } from "@/components/shared/thumb";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { money } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

export function ProductTile({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const user = useAuth((s) => s.user);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const soldOut = product.stock <= 0;

  const flash = (text: string) => { setNote(text); setTimeout(() => setNote(""), 3000); };

  const onAdd = async () => {
    if (!user) return router.push("/sign-in");
    if (user.role !== "customer") return flash("Sign in as a customer to shop.");
    setBusy(true);
    const ok = await add(product);
    setBusy(false);
    if (ok) { setAdded(true); setTimeout(() => setAdded(false), 1200); } else flash("Couldn't add that. Try again.");
  };

  return (
    <article className="flex min-w-0 flex-col rounded-[20px] border border-line/50 bg-panel p-2.5 transition-shadow hover:shadow-md sm:p-3">
      <div className="relative">
        <Link href={`/product/${product.id}`} aria-label={`View ${product.name}`} className="block"><Thumb product={product} className="aspect-square rounded-2xl" /></Link>
        {product.badge && <span className="absolute left-2 top-2 rounded-full bg-panel/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">{product.badge}</span>}
        <button onClick={() => setLiked(!liked)} aria-pressed={liked} aria-label="Save to wishlist" className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-panel/95">
          <Heart className={`size-4 ${liked ? "fill-bad text-bad" : ""}`} />
        </button>
      </div>
      <p className="mt-3 truncate text-xs text-ink-muted">{product.category}</p>
      <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 sm:text-[15px]"><Link href={`/product/${product.id}`} className="hover:text-brand">{product.name}</Link></h3>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p>
          <span className="block text-lg font-bold">{money(product.price).replace(".00", "")}</span>
          {soldOut ? <span className="text-xs font-semibold text-bad">Sold out</span> : product.oldPrice && <span className="text-xs text-ink-muted line-through">{money(product.oldPrice).replace(".00", "")}</span>}
        </p>
        <button
          onClick={onAdd}
          disabled={soldOut || busy}
          aria-label={`Add ${product.name} to cart`}
          className="grid size-10 place-items-center rounded-full bg-brand text-brand-ink transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? <Check className="size-5" /> : <Plus className="size-5" />}
        </button>
      </div>
      {note && <p role="status" className="mt-2 text-xs font-semibold text-bad">{note}</p>}
    </article>
  );
}

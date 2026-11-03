"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import { Thumb } from "@/components/shared/thumb";
import { selectSubtotal, useCart } from "@/hooks/use-cart";
import { FREE_SHIPPING_AT, PROMO_CODES, money } from "@/lib/catalog";

export function CartView() {
  const lines = useCart((s) => s.lines);
  const subtotal = useCart(selectSubtotal);
  const { setQty, remove, clear } = useCart.getState();
  const [input, setInput] = useState("");
  const [promo, setPromo] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const rate = promo ? PROMO_CODES[promo] : 0;
  const discount = subtotal * rate;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : 9;
  const tax = (subtotal - discount) * 0.072;
  const total = subtotal - discount + shipping + tax;
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_AT) * 100));

  const apply = () => {
    const code = input.trim().toUpperCase();
    if (PROMO_CODES[code]) { setPromo(code); setMsg(""); setInput(""); }
    else setMsg("That code isn't valid. Try SUMMER30.");
  };

  if (!lines.length) {
    return (
      <div className="mx-auto grid max-w-md place-items-center rounded-[24px] border border-dashed border-line px-6 py-16 text-center">
        <ShoppingBag className="size-10 text-ink-muted" />
        <h1 className="mt-4 text-2xl font-bold">Your bag is empty</h1>
        <p className="mt-1 text-ink-muted">Add something you love and it will show up here.</p>
        <Link href="/" className="mt-6 rounded-full bg-brand px-8 py-3 font-semibold text-brand-ink">Start shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">My Shopping Bag <span className="text-base font-normal text-ink-muted">({lines.length} {lines.length === 1 ? "item" : "items"})</span></h1>
        <button onClick={clear} className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-bad"><Trash2 className="size-4" /> Clear</button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-10">
        <div className="space-y-4">
          <div className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <div className="flex items-center gap-3 text-sm">
              <span className="grid size-8 place-items-center rounded-full bg-good-soft text-good"><Truck className="size-4" /></span>
              <p className="flex-1 font-semibold">
                {subtotal >= FREE_SHIPPING_AT ? "Free delivery unlocked!" : `Add ${money(FREE_SHIPPING_AT - subtotal)} more for free delivery`}
              </p>
              <span className="text-xs font-bold text-good">{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-good transition-all" style={{ width: `${progress}%` }} /></div>
          </div>

          <ul className="space-y-3">
            {lines.map(({ product: p, qty }) => (
              <li key={p.id} className="flex gap-4 rounded-[20px] border border-line/50 bg-panel p-3 sm:p-4">
                <Thumb product={p} className="size-24 shrink-0 rounded-2xl sm:size-28" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 font-semibold leading-snug">{p.name}</h2>
                      <p className="mt-0.5 text-xs text-ink-muted">{p.color}</p>
                    </div>
                    <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="text-ink-muted hover:text-bad"><Trash2 className="size-5" /></button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full bg-soft">
                      <button onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease quantity" className="grid size-9 place-items-center"><Minus className="size-4" /></button>
                      <span className="w-6 text-center text-sm font-bold" aria-live="polite">{qty}</span>
                      <button onClick={() => setQty(p.id, qty + 1)} aria-label="Increase quantity" className="grid size-9 place-items-center"><Plus className="size-4" /></button>
                    </div>
                    <p className="text-lg font-bold">{money(p.price * qty)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-semibold"><Tag className="size-4 text-brand" /> Promo code</p>
            {promo ? (
              <p className="mt-3 flex items-center justify-between rounded-xl bg-good-soft/50 px-3 py-2 text-sm font-semibold text-good">
                {promo} applied (−{Math.round(rate * 100)}%)
                <button onClick={() => setPromo(null)} aria-label="Remove promo code"><X className="size-4" /></button>
              </p>
            ) : (
              <>
                <div className="mt-3 flex gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} placeholder="SUMMER30" aria-label="Promo code" className="h-11 min-w-0 flex-1 rounded-xl bg-soft px-4 text-sm uppercase outline-none focus:ring-2 focus:ring-brand/30" />
                  <button onClick={apply} className="rounded-xl bg-soft px-5 text-sm font-bold text-brand">Apply</button>
                </div>
                {msg && <p className="mt-2 text-xs text-bad" role="alert">{msg}</p>}
              </>
            )}
          </div>

          <div className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Subtotal" v={money(subtotal)} />
              {discount > 0 && <Row k={`Promo (${promo})`} v={`−${money(discount)}`} good />}
              <Row k="Estimated shipping" v={shipping ? money(shipping) : "FREE"} good={!shipping} />
              <Row k="Estimated taxes" v={money(tax)} />
            </dl>
            <div className="mt-4 flex items-end justify-between border-t border-line/60 pt-4">
              <div><p className="font-bold">Total Due</p><p className="text-xs text-ink-muted">Includes local destination taxes</p></div>
              <p className="text-3xl font-bold text-brand">{money(total)}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="rounded-full bg-ink py-3 text-sm font-bold text-canvas">Pay</button>
              <button className="rounded-full bg-soft py-3 text-sm font-bold">G Pay</button>
            </div>
            <button onClick={() => setMsg("Checkout isn't connected yet.")} className="mt-3 flex w-full items-center justify-between rounded-full bg-brand px-5 py-4 text-brand-ink">
              <span className="flex items-center gap-2 font-semibold"><Lock className="size-4" /> Proceed to Checkout</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{money(total)}</span>
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted"><ShieldCheck className="size-4" /> 256-bit encrypted checkout · 30-day returns</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v, good }: { k: string; v: string; good?: boolean }) {
  return (
    <div className="flex justify-between"><dt className="text-ink-muted">{k}</dt><dd className={`font-semibold ${good ? "text-good" : ""}`}>{v}</dd></div>
  );
}

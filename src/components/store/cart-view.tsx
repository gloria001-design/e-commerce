"use client";

import Link from "next/link";
import { Lock, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Thumb } from "@/components/shared/thumb";
import { selectCount, selectSubtotal, useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { FREE_SHIPPING_AT, money } from "@/lib/catalog";

const empty = "mx-auto grid max-w-md place-items-center rounded-[24px] border border-dashed border-line px-6 py-16 text-center";
const cta = "mt-6 rounded-full bg-brand px-8 py-3 font-semibold text-brand-ink";

export function CartView() {
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const lines = useCart((s) => s.lines);
  const loaded = useCart((s) => s.loaded);
  const error = useCart((s) => s.error);
  const count = useCart(selectCount);
  const subtotal = useCart(selectSubtotal);
  const { load, setQty, remove, clear } = useCart.getState();

  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_AT) * 100));

  if (!hydrated) return <p className="py-16 text-center text-sm text-ink-muted">Loading your bag…</p>;

  if (user?.role !== "customer") {
    return (
      <div className={empty}>
        <ShoppingBag className="size-10 text-ink-muted" />
        <h1 className="mt-4 text-2xl font-bold">Sign in to see your bag</h1>
        <p className="mt-1 text-ink-muted">Your bag is saved to your customer account.</p>
        <Link href="/sign-in" className={cta}>Sign in</Link>
      </div>
    );
  }

  if (!loaded) return <p className="py-16 text-center text-sm text-ink-muted">Loading your bag…</p>;

  if (!lines.length) {
    return (
      <div className={empty}>
        <ShoppingBag className="size-10 text-ink-muted" />
        <h1 className="mt-4 text-2xl font-bold">Your bag is empty</h1>
        <p className="mt-1 text-ink-muted">Add something you love and it will show up here.</p>
        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-bad">
            {error} <button onClick={() => load()} className="underline">Retry</button>
          </p>
        )}
        <Link href="/" className={cta}>Start shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">My Shopping Bag <span className="text-base font-normal text-ink-muted">({count} {count === 1 ? "item" : "items"})</span></h1>
        <button onClick={() => clear()} className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-bad"><Trash2 className="size-4" /> Clear</button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-bad/10 px-3 py-2 text-sm font-semibold text-bad">{error}</p>}

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
            {lines.map(({ itemId, product: p, qty }) => (
              <li key={itemId} className="flex gap-4 rounded-[20px] border border-line/50 bg-panel p-3 sm:p-4">
                <Link href={`/product/${p.id}`} aria-label={`View ${p.name}`} className="shrink-0"><Thumb product={p} className="size-24 rounded-2xl sm:size-28" /></Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 font-semibold leading-snug"><Link href={`/product/${p.id}`} className="hover:text-brand">{p.name}</Link></h2>
                      <p className="mt-0.5 text-xs text-ink-muted">{p.color}</p>
                    </div>
                    <button onClick={() => remove(itemId)} aria-label={`Remove ${p.name}`} className="text-ink-muted hover:text-bad"><Trash2 className="size-5" /></button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full bg-soft">
                      <button onClick={() => setQty(itemId, qty - 1)} aria-label="Decrease quantity" className="grid size-9 place-items-center"><Minus className="size-4" /></button>
                      <span className="w-6 text-center text-sm font-bold" aria-live="polite">{qty}</span>
                      <button onClick={() => setQty(itemId, qty + 1)} disabled={qty >= p.stock} aria-label="Increase quantity" className="grid size-9 place-items-center disabled:opacity-30"><Plus className="size-4" /></button>
                    </div>
                    <p className="text-lg font-bold">{money(p.price * qty)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Subtotal" v={money(subtotal)} />
              <Row k="Shipping" v={subtotal >= FREE_SHIPPING_AT ? "FREE" : "Calculated at checkout"} good={subtotal >= FREE_SHIPPING_AT} />
            </dl>
            <div className="mt-4 flex items-end justify-between border-t border-line/60 pt-4">
              <p className="font-bold">Total</p>
              <p className="text-3xl font-bold text-brand">{money(subtotal)}</p>
            </div>

            <Link href="/checkout" className="mt-5 flex w-full items-center justify-between rounded-full bg-brand px-5 py-4 text-brand-ink transition-transform active:scale-[0.99]">
              <span className="flex items-center gap-2 font-semibold"><Lock className="size-4" /> Checkout</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{money(subtotal)}</span>
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted"><ShieldCheck className="size-4" /> Secure checkout · 30-day returns</p>
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

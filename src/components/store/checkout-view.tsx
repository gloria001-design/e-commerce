"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Banknote, CheckCircle2, Loader2, Lock, MapPin, Phone, ShoppingBag, Truck, UserRound } from "lucide-react";
import { Field } from "@/components/shared/field";
import { Thumb } from "@/components/shared/thumb";
import { useAuth } from "@/hooks/use-auth";
import { selectSubtotal, useCart } from "@/hooks/use-cart";
import { createDelivery, createOrder, type ApiOrder, type DeliveryInput } from "@/lib/api";
import { TAX_RATE, money } from "@/lib/catalog";
import { REGIONS, zoneFor, type RegionCode } from "@/lib/delivery";

/**
 * Checkout, wired to the backend in two steps:
 *   1. POST /order/create (no body): turns the server-side cart into an order (subtotal + 7.2% tax, status PENDING).
 *   2. POST /delivery/create/{orderId}: attaches the address.
 * There is no payment endpoint, so the order stays PENDING. The backend also sets the delivery method
 * (door) and fee (0) itself, so the form has no method or fee choice. If step 2 fails after step 1
 * succeeded, the created order is kept in state and a retry only repeats step 2 (no duplicate order).
 */
type Placed = { order: ApiOrder; to: string };

const empty = "mx-auto grid max-w-md place-items-center rounded-[24px] border border-dashed border-line px-6 py-16 text-center";
const cta = "mt-6 rounded-full bg-brand px-8 py-3 font-semibold text-brand-ink";
const select = "h-12 w-full rounded-2xl border border-line bg-panel px-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function CheckoutView() {
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const lines = useCart((s) => s.lines);
  const loaded = useCart((s) => s.loaded);
  const subtotal = useCart(selectSubtotal);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [street, setStreet] = useState("");
  const [region, setRegion] = useState<RegionCode | "">("");
  const [area, setArea] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<ApiOrder | null>(null); // created but not yet given an address
  const [placed, setPlaced] = useState<Placed | null>(null);

  const zone = region ? zoneFor(region) : undefined;
  // Estimate shown before the order exists; the real figures come back from the backend.
  const subtotalMinor = Math.round(subtotal * 100);
  const tax = Math.round(subtotalMinor * TAX_RATE);
  const total = subtotalMinor + tax;
  const minor = (n: number) => money(n / 100);

  if (placed) {
    const o = placed.order;
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[24px] border border-line/50 bg-panel p-6 text-center sm:p-8">
          <CheckCircle2 className="mx-auto size-12 text-good" />
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Order placed</h1>
          <p className="mt-1 text-ink-muted">Reference <b className="text-ink">{o.id.slice(0, 8).toUpperCase()}</b> · {o.status.toLowerCase()}</p>
          <dl className="mt-6 space-y-3 rounded-2xl bg-soft p-4 text-left text-sm">
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Deliver to</dt><dd className="text-right font-semibold">{placed.to}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Subtotal</dt><dd className="font-semibold">{minor(o.subtotal)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Tax</dt><dd className="font-semibold">{minor(o.tax)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Delivery</dt><dd className="font-semibold">{o.shipping === 0 ? "Free" : minor(o.shipping)}</dd></div>
            <div className="flex justify-between gap-4 border-t border-line/60 pt-3"><dt className="font-bold">Total</dt><dd className="font-bold text-brand">{minor(o.total)}</dd></div>
          </dl>
          <ul className="mt-5 space-y-2 text-left text-sm">
            {o.items.map((i) => <li key={i.id} className="flex justify-between gap-3"><span className="min-w-0 truncate">{i.quantity} × {i.productTitle}</span><span className="font-semibold">{minor(i.unitPrice * i.quantity)}</span></li>)}
          </ul>
          <Link href="/" className={`${cta} inline-block`}>Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (!hydrated) return <p className="py-16 text-center text-sm text-ink-muted">Loading checkout…</p>;

  if (user?.role !== "customer") {
    return (
      <div className={empty}>
        <Lock className="size-10 text-ink-muted" />
        <h1 className="mt-4 text-2xl font-bold">Sign in to check out</h1>
        <Link href="/sign-in" className={cta}>Sign in</Link>
      </div>
    );
  }

  if (!loaded) return <p className="py-16 text-center text-sm text-ink-muted">Loading checkout…</p>;

  if (!lines.length) {
    return (
      <div className={empty}>
        <ShoppingBag className="size-10 text-ink-muted" />
        <h1 className="mt-4 text-2xl font-bold">Your bag is empty</h1>
        <Link href="/" className={cta}>Start shopping</Link>
      </div>
    );
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region) return;
    setBusy(true); setError("");
    const address: DeliveryInput = { fullName: name.trim(), streetAddress: street.trim(), phoneNumber: phone.trim(), region, area: area.trim() };
    let current = order; // declared outside try so the catch knows whether the order already exists
    try {
      if (!current) {
        current = (await createOrder()).order;
        setOrder(current);
      }
      await createDelivery(current.id, address);
      // The spec doesn't say whether ordering empties the cart, so re-sync and clear whatever is left.
      await useCart.getState().load();
      if (useCart.getState().lines.length) await useCart.getState().clear();
      useCart.setState({ error: "" });
      setPlaced({ order: current, to: `${address.streetAddress}, ${address.area}, ${REGIONS.find((r) => r[0] === region)?.[1] ?? region}` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "We could not place your order.";
      setError(current ? `${msg} Your order was created; tap the button again to retry saving the address.` : msg);
    } finally { setBusy(false); }
  };

  return (
    <div>
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-brand"><ArrowLeft className="size-4" />Back to bag</Link>
      <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-10">
        <div className="space-y-6">
          <section className="space-y-4 rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <h2 className="text-lg font-bold">1. Delivery details</h2>
            <Field label="Full name" icon={UserRound} value={name} onChange={setName} autoComplete="name" />
            <Field label="Phone number" icon={Phone} type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Region
                <select required value={region} onChange={(e) => { setRegion(e.target.value as RegionCode); setArea(""); }} className={`${select} mt-1.5`}>
                  <option value="">Choose region</option>
                  {REGIONS.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </label>
              {zone ? (
                <label className="block text-sm font-semibold">Area
                  <select required value={area} onChange={(e) => setArea(e.target.value)} className={`${select} mt-1.5`}>
                    <option value="">Choose area</option>
                    {zone.areas.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </label>
              ) : (
                <label className="block text-sm font-semibold">Area
                  <input required disabled={!region} value={area} onChange={(e) => setArea(e.target.value)} placeholder="Town or neighbourhood" className={`${select} mt-1.5 disabled:opacity-50`} />
                </label>
              )}
            </div>
            <Field label="Street address" icon={MapPin} value={street} onChange={setStreet} autoComplete="street-address" placeholder="House number, street, landmark" />
          </section>

          <section className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <h2 className="text-lg font-bold">2. Delivery &amp; payment</h2>
            <div className="mt-3 space-y-3 text-sm">
              <p className="flex items-start gap-3"><Truck className="mt-0.5 size-5 shrink-0 text-brand" /><span><b className="block">Door delivery · Free</b><span className="text-ink-muted">We&apos;ll deliver to the address above.</span></span></p>
              <p className="flex items-start gap-3"><Banknote className="mt-0.5 size-5 shrink-0 text-brand" /><span><b className="block">Payment after you order</b><span className="text-ink-muted">Online payment isn&apos;t available yet. Your order is placed as pending and the store will follow up.</span></span></p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <h2 className="text-lg font-bold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.itemId} className="flex items-center gap-3 text-sm">
                  <Thumb product={l.product} className="size-14 shrink-0 rounded-xl" />
                  <span className="min-w-0 flex-1"><span className="line-clamp-2 font-semibold">{l.product.name}</span><span className="text-ink-muted">Qty {l.qty}</span></span>
                  <b>{money(l.product.price * l.qty)}</b>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-3 border-t border-line/60 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-ink-muted">Subtotal</dt><dd className="font-semibold">{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Tax ({(TAX_RATE * 100).toFixed(1)}%)</dt><dd className="font-semibold">{minor(tax)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Delivery</dt><dd className="font-semibold text-good">FREE</dd></div>
            </dl>
            <div className="mt-4 flex items-end justify-between border-t border-line/60 pt-4"><p className="font-bold">Total</p><p className="text-3xl font-bold text-brand">{minor(total)}</p></div>

            <button type="submit" disabled={busy || !region} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 font-semibold text-brand-ink transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
              {busy ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-4" />} {order ? "Retry saving address" : "Place order"} · {minor(total)}
            </button>
            {error && <p role="alert" className="mt-3 rounded-xl bg-bad/10 px-3 py-2 text-center text-sm font-semibold text-bad">{error}</p>}
          </div>
        </aside>
      </form>
    </div>
  );
}

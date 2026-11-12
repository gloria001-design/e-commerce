"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, Loader2, Lock, MapPin, Phone, ShoppingBag, Store, Truck, UserRound } from "lucide-react";
import { Field } from "@/components/shared/field";
import { Thumb } from "@/components/shared/thumb";
import { useAuth } from "@/hooks/use-auth";
import { selectSubtotal, useCart } from "@/hooks/use-cart";
import { money } from "@/lib/catalog";
import { ZONES, getDeliveryOptions } from "@/lib/delivery";
import type { CartLine } from "@/types/catalog";

/**
 * TEMPORARY checkout. The backend has no order/payment endpoint wired up yet, so "Place order" only
 * empties the cart through the real cart API and shows a confirmation. Any error shown here is the
 * backend's own message (from the cart calls); the form uses the browser's built-in field validation.
 * When an orders endpoint exists, call it in `placeOrder` before clearing the cart.
 */
type Placed = { ref: string; lines: CartLine[]; total: number; fee: number; method: string; payment: string; to: string; window: string };

const empty = "mx-auto grid max-w-md place-items-center rounded-[24px] border border-dashed border-line px-6 py-16 text-center";
const cta = "mt-6 rounded-full bg-brand px-8 py-3 font-semibold text-brand-ink";
const select = "h-12 w-full rounded-2xl border border-line bg-panel px-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
const fmt = (d: Date) => d.toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" });

export function CheckoutView() {
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const lines = useCart((s) => s.lines);
  const loaded = useCart((s) => s.loaded);
  const subtotal = useCart(selectSubtotal);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [street, setStreet] = useState("");
  const [region, setRegion] = useState("");
  const [area, setArea] = useState("");
  const [method, setMethod] = useState<"door" | "pickup">("door");
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Placed | null>(null);

  const zone = ZONES.find((z) => z.region === region);
  const options = useMemo(() => getDeliveryOptions(region, subtotal), [region, subtotal]);
  const chosen = options.find((o) => o.kind === method);
  const fee = chosen?.fee ?? 0;
  const total = subtotal + fee;

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[24px] border border-line/50 bg-panel p-6 text-center sm:p-8">
          <CheckCircle2 className="mx-auto size-12 text-good" />
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Order placed</h1>
          <p className="mt-1 text-ink-muted">Reference <b className="text-ink">{placed.ref}</b></p>
          <dl className="mt-6 space-y-3 rounded-2xl bg-soft p-4 text-left text-sm">
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">{placed.method}</dt><dd className="text-right font-semibold">{placed.window}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Deliver to</dt><dd className="text-right font-semibold">{placed.to}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Payment</dt><dd className="text-right font-semibold">{placed.payment}</dd></div>
            <div className="flex justify-between gap-4 border-t border-line/60 pt-3"><dt className="font-bold">Total</dt><dd className="font-bold text-brand">{money(placed.total)}</dd></div>
          </dl>
          <ul className="mt-5 space-y-2 text-left text-sm">
            {placed.lines.map((l) => <li key={l.itemId} className="flex justify-between gap-3"><span className="min-w-0 truncate">{l.qty} × {l.product.name}</span><span className="font-semibold">{money(l.product.price * l.qty)}</span></li>)}
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
    if (!chosen) return;
    setBusy(true); setError("");
    const snapshot = [...lines];
    useCart.setState({ error: "" });
    await useCart.getState().clear(); // real cart API; failures land in the store as the backend's message
    const backendError = useCart.getState().error;
    setBusy(false);
    if (backendError) return setError(backendError);
    setPlaced({
      ref: `AUR-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      lines: snapshot, total, fee, method: chosen.label,
      payment: payment === "cod" ? "Pay on delivery" : "Pay online",
      to: method === "pickup" ? `Pickup station near ${area}, ${region}` : `${street}, ${area}, ${region}`,
      window: `${fmt(chosen.from)} – ${fmt(chosen.to)}`,
    });
  };

  const radio = (on: boolean) => `flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${on ? "border-brand bg-brand/5" : "border-line hover:border-ink-muted"}`;

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
                <select required value={region} onChange={(e) => { setRegion(e.target.value); setArea(""); }} className={`${select} mt-1.5`}>
                  <option value="">Choose region</option>
                  {ZONES.map((z) => <option key={z.region}>{z.region}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold">Area
                <select required value={area} disabled={!zone} onChange={(e) => setArea(e.target.value)} className={`${select} mt-1.5 disabled:opacity-50`}>
                  <option value="">Choose area</option>
                  {zone?.areas.map((a) => <option key={a}>{a}</option>)}
                </select>
              </label>
            </div>
            {method === "door" && <Field label="Street address" icon={MapPin} value={street} onChange={setStreet} autoComplete="street-address" placeholder="House number, street, landmark" />}
          </section>

          <section className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <h2 className="text-lg font-bold">2. Delivery method</h2>
            {options.length === 0 ? <p className="mt-3 text-sm text-ink-muted">Choose your region to see delivery options.</p> : (
              <div className="mt-3 grid gap-3">
                {options.map((o) => (
                  <label key={o.kind} className={radio(method === o.kind)}>
                    <input type="radio" name="method" className="sr-only" checked={method === o.kind} onChange={() => setMethod(o.kind)} />
                    {o.kind === "door" ? <Truck className="mt-0.5 size-5 shrink-0 text-brand" /> : <Store className="mt-0.5 size-5 shrink-0 text-brand" />}
                    <span className="min-w-0 flex-1"><b className="block text-sm">{o.label}</b><span className="text-sm text-ink-muted">Arrives {fmt(o.from)} – {fmt(o.to)}</span></span>
                    <b className={`text-sm ${o.fee === 0 ? "text-good" : ""}`}>{o.fee === 0 ? "Free" : money(o.fee)}</b>
                  </label>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
            <h2 className="text-lg font-bold">3. Payment</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className={radio(payment === "cod")}><input type="radio" name="pay" className="sr-only" checked={payment === "cod"} onChange={() => setPayment("cod")} /><Banknote className="mt-0.5 size-5 shrink-0 text-brand" /><span><b className="block text-sm">Pay on delivery</b><span className="text-sm text-ink-muted">Cash or transfer when it arrives</span></span></label>
              <label className={radio(payment === "online")}><input type="radio" name="pay" className="sr-only" checked={payment === "online"} onChange={() => setPayment("online")} /><CreditCard className="mt-0.5 size-5 shrink-0 text-brand" /><span><b className="block text-sm">Pay online</b><span className="text-sm text-ink-muted">Card or bank transfer</span></span></label>
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
              <div className="flex justify-between"><dt className="text-ink-muted">Delivery</dt><dd className={`font-semibold ${chosen && fee === 0 ? "text-good" : ""}`}>{!chosen ? "—" : fee === 0 ? "FREE" : money(fee)}</dd></div>
            </dl>
            <div className="mt-4 flex items-end justify-between border-t border-line/60 pt-4"><p className="font-bold">Total</p><p className="text-3xl font-bold text-brand">{money(total)}</p></div>

            <button type="submit" disabled={busy || !chosen} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 font-semibold text-brand-ink transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
              {busy ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-4" />} Place order · {money(total)}
            </button>
            {error && <p role="alert" className="mt-3 rounded-xl bg-bad/10 px-3 py-2 text-center text-sm font-semibold text-bad">{error}</p>}
          </div>
        </aside>
      </form>
    </div>
  );
}

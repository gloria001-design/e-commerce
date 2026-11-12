"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, Heart, Loader2, Lock, Minus, PackageOpen, Plus, RefreshCw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { DeliveryEstimator } from "@/components/store/delivery-estimator";
import { ProductTile } from "@/components/store/product-tile";
import { Thumb } from "@/components/shared/thumb";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { getProductDetail, type ApiError } from "@/lib/api";
import { FREE_SHIPPING_AT, money, categoryLabel } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

type Status = "loading" | "ready" | "missing" | "auth" | "error";
const panel = "grid place-items-center rounded-[20px] border border-dashed border-line p-12 text-center";
const LOW_STOCK = 5;

/** Backend "colour" is free text. Show a swatch only when the browser understands it as a CSS colour. */
const isCssColor = (c: string) => typeof CSS !== "undefined" && !!c && CSS.supports("color", c);

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const add = useCart((s) => s.add);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState<"" | "cart" | "buy">("");
  const [added, setAdded] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    setStatus("loading");
    getProductDetail(id, user?.role === "customer")
      .then(({ product, related }) => {
        if (!alive) return;
        setProduct(product); setRelated(related); setActive(0); setQty(1);
        setStatus(product ? "ready" : "missing");
      })
      .catch((e: ApiError) => { if (!alive) return; setError(e.message); setStatus(e.status === 401 ? "auth" : "error"); });
    return () => { alive = false; };
  }, [hydrated, id, user?.role, user?.email, attempt]);

  if (status === "loading") return <DetailSkeleton />;

  if (status !== "ready" || !product) {
    const view = {
      auth: { icon: Lock, title: "Sign in as a customer to view this product", body: "" },
      error: { icon: RefreshCw, title: "We couldn't load this product", body: error },
      missing: { icon: PackageOpen, title: "This product isn't available", body: "It may have been removed by the vendor." },
    }[status as "auth" | "error" | "missing"];
    const Icon = view.icon;
    return (
      <div className="space-y-5">
        <BackLink />
        <div className={panel}>
          <Icon className="size-8 text-ink-muted" />
          <p className="mt-3 font-semibold">{view.title}</p>
          {view.body && <p className="mt-1 max-w-sm text-sm text-ink-muted">{view.body}</p>}
          <div className="mt-4 flex gap-3">
            {status === "auth" && <><Link href="/sign-in" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink">Sign in</Link><Link href="/sign-up" className="rounded-full border border-line px-5 py-2.5 text-sm font-bold">Create account</Link></>}
            {status === "error" && <button onClick={() => setAttempt((n) => n + 1)} className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink">Try again</button>}
            {status === "missing" && <Link href="/" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink">Back to shop</Link>}
          </div>
        </div>
      </div>
    );
  }

  const photos = product.images?.length ? product.images : [];
  const soldOut = product.stock <= 0;
  const maxQty = Math.max(1, product.stock);
  const total = product.price * qty;
  const toFree = FREE_SHIPPING_AT - product.price * qty;

  const flash = (text: string) => { setNote(text); setTimeout(() => setNote(""), 3500); };

  const addToCart = async (mode: "cart" | "buy") => {
    if (!user) return router.push("/sign-in");
    if (user.role !== "customer") return flash("Sign in as a customer to shop.");
    setBusy(mode);
    const ok = await add(product, qty);
    setBusy("");
    if (!ok) return flash(useCart.getState().error);
    if (mode === "buy") return router.push("/cart");
    setAdded(true); setTimeout(() => setAdded(false), 1400);
  };

  const stockLabel = soldOut ? { text: "Sold out", cls: "bg-bad/10 text-bad" }
    : product.stock <= LOW_STOCK ? { text: `Only ${product.stock} left`, cls: "bg-warn-soft text-warn" }
    : { text: "In stock", cls: "bg-good-soft text-good" };

  return (
    <div className="space-y-10 pb-28 md:pb-0 lg:space-y-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted sm:text-sm">
        <Link href="/" className="hover:text-brand">Shop</Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span>{categoryLabel(product.category)}</span>
        <ChevronRight className="size-3.5" aria-hidden />
        <span aria-current="page" className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-[28px] border border-line/60 bg-panel p-2.5 sm:p-3">
            <Thumb product={{ ...product, image: photos[active] ?? product.image }} className="aspect-square rounded-[20px] sm:aspect-[5/4]" />
            {product.badge && <span className="absolute left-5 top-5 rounded-full bg-panel/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">{product.badge}</span>}
            <button onClick={() => setLiked(!liked)} aria-pressed={liked} aria-label="Save to wishlist" className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-panel/95 transition-transform active:scale-95">
              <Heart className={`size-5 ${liked ? "fill-bad text-bad" : ""}`} />
            </button>
          </div>
          {photos.length > 1 && (
            <ul className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Product photos">
              {photos.map((src, i) => (
                <li key={src + i} className="shrink-0">
                  <button onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-current={active === i}
                    className={`block size-16 overflow-hidden rounded-xl bg-soft ring-2 transition sm:size-20 ${active === i ? "ring-brand" : "ring-transparent opacity-70 hover:opacity-100"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buy box */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-ink-muted hover:text-brand">{categoryLabel(product.category)}</Link>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${stockLabel.cls}`}>{stockLabel.text}</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>

          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-brand sm:text-4xl">{money(product.price)}</span>
            {product.oldPrice && <span className="text-base text-ink-muted line-through">{money(product.oldPrice)}</span>}
          </p>

          {product.color && (
            <p className="mt-5 flex items-center gap-2.5 text-sm">
              <span className="font-semibold text-ink-muted">Colour</span>
              {isCssColor(product.color) && <span aria-hidden className="size-5 rounded-full ring-2 ring-line ring-offset-2 ring-offset-canvas" style={{ background: product.color }} />}
              <span className="font-semibold capitalize">{product.color}</span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div role="group" aria-label="Quantity" className="flex items-center rounded-full border border-line bg-panel p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1 || soldOut} aria-label="Decrease quantity" className="grid size-10 place-items-center rounded-full hover:bg-soft disabled:opacity-40"><Minus className="size-4" /></button>
              <output aria-live="polite" className="w-10 text-center text-base font-bold tabular-nums">{qty}</output>
              <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty || soldOut} aria-label="Increase quantity" className="grid size-10 place-items-center rounded-full hover:bg-soft disabled:opacity-40"><Plus className="size-4" /></button>
            </div>
            {!soldOut && <span className="text-sm text-ink-muted">Total <b className="text-ink">{money(total)}</b></span>}
          </div>

          <div className="mt-5 hidden gap-3 md:flex">
            <button onClick={() => addToCart("cart")} disabled={soldOut || !!busy}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-base font-bold text-brand-ink transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
              {busy === "cart" ? <Loader2 className="size-5 animate-spin" /> : added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
              {soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart"}
            </button>
            <button onClick={() => addToCart("buy")} disabled={soldOut || !!busy}
              className="h-14 rounded-full border border-brand/60 px-7 text-base font-bold text-brand transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40">
              {busy === "buy" ? <Loader2 className="mx-3 size-5 animate-spin" /> : "Buy now"}
            </button>
          </div>
          {note && <p role="status" className="mt-3 text-sm font-semibold text-bad">{note}</p>}

          <DeliveryEstimator orderTotal={total} disabled={soldOut} />

          <ul className="mt-4 grid gap-3 rounded-[20px] border border-line/60 bg-panel p-4 text-sm sm:grid-cols-2 sm:gap-4">
            <li className="flex items-start gap-2.5"><Truck className="mt-0.5 size-5 shrink-0 text-brand" /><span><b className="block">Free shipping</b><span className="text-ink-muted">{toFree <= 0 ? "Unlocked on this order" : `${money(toFree)} away from free`}</span></span></li>
            <li className="flex items-start gap-2.5"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" /><span><b className="block">Secure checkout</b><span className="text-ink-muted">Protected orders</span></span></li>
          </ul>

          <section className="mt-8">
            <h2 className="text-lg font-bold">About this item</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-muted">{product.description?.trim() || "The vendor hasn't added a description yet."}</p>
            <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/60 text-sm">
              {[["Category", categoryLabel(product.category)], ["Colour", product.color || "—"], ["Availability", soldOut ? "Out of stock" : `${product.stock} in stock`], ["Price", money(product.price)]].map(([k, v]) => (
                <div key={k} className="bg-panel p-3.5"><dt className="text-xs text-ink-muted">{k}</dt><dd className="mt-0.5 font-semibold capitalize">{v}</dd></div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related">
          <h2 id="related" className="text-xl font-bold sm:text-2xl">More in {categoryLabel(product.category)}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductTile key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Phone buy bar, sits above the bottom nav */}
      <div className="fixed inset-x-3 bottom-[76px] z-30 flex items-center gap-3 rounded-2xl border border-line/70 bg-panel/95 p-2.5 pl-4 shadow-lg backdrop-blur-xl md:hidden">
        <p className="min-w-0 flex-1 leading-tight"><span className="block text-xs text-ink-muted">{qty > 1 ? `${qty} items` : "Price"}</span><span className="block text-lg font-extrabold">{money(total)}</span></p>
        <button onClick={() => addToCart("cart")} disabled={soldOut || !!busy}
          className="flex h-12 items-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-brand-ink active:scale-[0.98] disabled:opacity-40">
          {busy ? <Loader2 className="size-4 animate-spin" /> : added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
          {soldOut ? "Sold out" : added ? "Added" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

function BackLink() {
  return <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-brand"><ArrowLeft className="size-4" />Back to shop</Link>;
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading product">
      <div className="h-4 w-56 rounded bg-soft" />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div><div className="aspect-square rounded-[28px] bg-soft sm:aspect-[5/4]" /><div className="mt-3 flex gap-2.5">{[0, 1, 2].map((i) => <div key={i} className="size-16 rounded-xl bg-soft sm:size-20" />)}</div></div>
        <div className="space-y-4"><div className="h-6 w-32 rounded-full bg-soft" /><div className="h-10 w-3/4 rounded bg-soft" /><div className="h-10 w-40 rounded bg-soft" /><div className="h-14 rounded-full bg-soft" /><div className="h-28 rounded-[20px] bg-soft" /></div>
      </div>
    </div>
  );
}

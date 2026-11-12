"use client";

import Link from "next/link";
import { Grid2x2, Lock, PackageOpen, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductTile } from "@/components/store/product-tile";
import { getProducts, productToCatalog, type ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@/types/catalog";

type Status = "loading" | "ready" | "auth" | "error";
const panel = "mt-6 grid place-items-center rounded-[20px] border border-dashed border-line p-12 text-center";

export function Catalog({ query = "" }: { query?: string }) {
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const [cat, setCat] = useState<string>("All");
  const [items, setItems] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Products come from the backend only. Re-fetch when the session changes (cookie added/removed).
  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    setStatus("loading");
    getProducts()
      .then((data) => { if (!alive) return; setItems((data?.products ?? []).map(productToCatalog)); setStatus("ready"); })
      .catch((e: ApiError) => { if (!alive) return; setError(e.message); setStatus(e.status === 401 ? "auth" : "error"); });
    return () => { alive = false; };
  }, [hydrated, user?.role, user?.email, attempt]);

  const categories = useMemo(() => Array.from(new Set(items.map((p) => p.category))).sort(), [items]);
  const list = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((p) => (cat === "All" || p.category === cat) && (!q || p.name.toLowerCase().includes(q)));
  }, [cat, query, items]);

  if (status === "loading") {
    return (
      <section id="picks" className="scroll-mt-24 animate-pulse" aria-busy="true">
        <div className="mt-6 h-7 w-40 rounded bg-soft" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] rounded-[20px] bg-soft" />)}
        </div>
      </section>
    );
  }

  return (
    <section id="picks" className="scroll-mt-24">
      {status === "auth" && (
        <div className={panel}>
          <Lock className="size-8 text-ink-muted" />
          <p className="mt-3 font-semibold">Sign in as a customer to browse the market</p>
          <div className="mt-4 flex gap-3">
            <Link href="/sign-in" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink">Sign in</Link>
            <Link href="/sign-up" className="rounded-full border border-line px-5 py-2.5 text-sm font-bold">Create account</Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className={panel}>
          <RefreshCw className="size-8 text-ink-muted" />
          <p className="mt-3 font-semibold">We couldn&apos;t load products</p>
          <p className="mt-1 max-w-sm text-sm text-ink-muted">{error}</p>
          <button onClick={() => setAttempt((n) => n + 1)} className="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink">Try again</button>
        </div>
      )}

      {status === "ready" && (
        <>
          {categories.length > 0 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Categories">
              {["All", ...categories].map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold ${cat === c ? "bg-brand text-brand-ink" : "bg-panel text-ink-muted ring-1 ring-line/60"}`}>
                  {c === "All" && <Grid2x2 className="size-4" />}
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-baseline justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">Curated Picks</h2>
            <span className="text-sm font-semibold text-brand">{list.length} {list.length === 1 ? "item" : "items"}{query && ` for “${query}”`}</span>
          </div>

          {list.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {list.map((p) => <ProductTile key={p.id} product={p} />)}
            </div>
          ) : items.length === 0 ? (
            <div className={panel}>
              <PackageOpen className="size-8 text-ink-muted" />
              <p className="mt-3 font-semibold">No products yet</p>
              <p className="mt-1 text-sm text-ink-muted">Vendors haven&apos;t listed anything. Check back soon.</p>
            </div>
          ) : (
            <div className={panel}>
              <Search className="size-8 text-ink-muted" />
              <p className="mt-3 font-semibold">Nothing matches that search</p>
              <button onClick={() => setCat("All")} className="mt-3 text-sm font-semibold text-brand">Show all products</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Boxes, ChevronRight, PackageOpen, PackagePlus, ReceiptText, RefreshCw, Wallet } from "lucide-react";
import { money } from "@/lib/catalog";
import { getProducts, productToCatalog } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { ChangePasswordCard } from "@/components/shared/change-password";
import { Thumb } from "@/components/shared/thumb";
import type { Product } from "@/types/catalog";

const LOW_STOCK = 5;
const card = "rounded-[24px] border border-line/50 bg-panel";

const shortcuts = [
  { href: "/vendor/products/new", label: "Add Item", icon: PackagePlus },
  { label: "Orders", icon: ReceiptText },
  { label: "Analytics", icon: BarChart3 },
];

export function Dashboard() {
  const hydrated = useAuth((s) => s.hydrated);
  const role = useAuth((s) => s.user?.role);
  const [items, setItems] = useState<Product[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!hydrated || role !== "vendor") return;
    let alive = true;
    setError("");
    getProducts(true)
      .then((data) => { if (alive) setItems((data?.products ?? []).map(productToCatalog)); })
      .catch((e: Error) => { if (alive) { setItems([]); setError(e.message); } });
    return () => { alive = false; };
  }, [hydrated, role, attempt]);

  const stats = useMemo(() => {
    const list = items ?? [];
    return {
      products: list.length,
      units: list.reduce((n, p) => n + p.stock, 0),
      value: list.reduce((n, p) => n + p.stock * p.price, 0),
      low: list.filter((p) => p.stock <= LOW_STOCK).sort((a, b) => a.stock - b.stock),
    };
  }, [items]);

  return (
    <div className="space-y-8">
      {error && (
        <p role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl bg-bad/10 px-4 py-3 text-sm font-semibold text-bad">
          {error}
          <button onClick={() => setAttempt((n) => n + 1)} className="inline-flex items-center gap-1 underline"><RefreshCw className="size-3.5" /> Retry</button>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Boxes} label="Products listed" value={items ? String(stats.products) : "…"} />
        <Stat icon={PackageOpen} label="Units in stock" value={items ? String(stats.units) : "…"} />
        <Stat icon={Wallet} label="Inventory value" value={items ? money(stats.value) : "…"} />
      </div>

      {stats.low.length > 0 && (
        <div className="flex flex-col gap-3 rounded-[24px] bg-[var(--warn-soft)]/70 p-4 sm:p-5">
          <p className="flex items-center gap-2 font-bold text-ink"><AlertTriangle className="size-5 text-[var(--warn)]" /> Low stock ({stats.low.length})</p>
          <ul className="space-y-1 text-sm">
            {stats.low.slice(0, 5).map((p) => (
              <li key={p.id} className="flex justify-between gap-3"><span className="truncate">{p.name}</span><span className="shrink-0 font-semibold text-ink-muted">{p.stock === 0 ? "Sold out" : `${p.stock} left`}</span></li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight">Shortcuts</h2>
        <div className="grid grid-cols-3 gap-3">
          {shortcuts.map(({ href, label, icon: Icon }) => {
            const body = (
              <>
                <span className="grid size-11 place-items-center rounded-full bg-soft text-brand"><Icon className="size-5" /></span>
                <span className="text-sm font-semibold">{label}</span>
              </>
            );
            const cls = `${card} flex flex-col items-center gap-3 p-5 transition-colors`;
            return href ? (
              <Link key={label} href={href} className={`${cls} hover:border-brand/40 hover:bg-soft/40`}>{body}</Link>
            ) : (
              <span key={label} aria-disabled className={`${cls} opacity-50`}>{body}<span className="text-[10px] uppercase tracking-wide text-ink-muted">Soon</span></span>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Your displayed catalog</h2>
            <p className="mt-1 text-sm text-ink-muted">Products customers can discover and buy today.</p>
          </div>
          <Link href="/vendor/products/new" className="inline-flex items-center gap-1 text-sm font-semibold text-brand">Add product <ChevronRight className="size-4" /></Link>
        </div>
        {items === null ? (
          <p className="text-sm text-ink-muted">Loading your products…</p>
        ) : items.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((product) => (
              <article key={product.id} className={`${card} p-2.5`}>
                <Thumb product={product} className="aspect-square rounded-xl" />
                <p className="mt-2 line-clamp-2 px-1 text-sm font-semibold">{product.name}</p>
                <p className="flex justify-between px-1 pb-1 pt-1 text-sm"><span className="font-bold">{money(product.price).replace(".00", "")}</span><span className="text-xs text-ink-muted">{product.stock} in stock</span></p>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-[20px] border border-dashed border-line p-10 text-center">
            <PackageOpen className="size-8 text-ink-muted" />
            <p className="mt-3 font-semibold">You haven&apos;t listed anything yet</p>
            <Link href="/vendor/products/new" className="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink">Add your first product</Link>
          </div>
        )}
      </section>

      <section className="max-w-md">
        <h2 className="mb-4 text-lg font-bold tracking-tight">Security</h2>
        <ChangePasswordCard admin />
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Boxes; label: string; value: string }) {
  return (
    <section className={`${card} p-5`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        <span className="grid size-10 place-items-center rounded-full bg-soft text-brand"><Icon className="size-5" /></span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
    </section>
  );
}

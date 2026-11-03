"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, BarChart3, ChevronRight, PackagePlus, ReceiptText, TicketPercent, TrendingUp, Truck } from "lucide-react";
import { recentOrders, revenue, type Period } from "@/lib/admin-data";

const statusStyle: Record<string, string> = {
  Processing: "bg-[var(--warn-soft)] text-[var(--warn)]",
  Paid: "bg-soft text-brand",
  Delivered: "bg-good-soft/60 text-good",
};

const shortcuts = [
  { href: "/admin/products/new", label: "Add Item", icon: PackagePlus },
  { label: "Orders", icon: ReceiptText },
  { label: "Analytics", icon: BarChart3 },
  { label: "Coupons", icon: TicketPercent },
];

const card = "rounded-[24px] border border-line/50 bg-panel";

export function Dashboard() {
  const [period, setPeriod] = useState<Period>("Today");
  const r = revenue[period];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand">Aura</span>
          <h2 className="mt-1 text-3xl font-bold tracking-tight lg:hidden">Overview</h2>
          <p className="mt-1 text-sm text-ink-muted">Flagship storefront · US East</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-good-soft/50 px-3 py-1.5 text-xs font-bold text-good">
          <span className="size-2 rounded-full bg-good" /> Live
        </span>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Period" className="inline-flex rounded-full bg-soft p-1">
          {(Object.keys(revenue) as Period[]).map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={period === p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                period === p ? "bg-panel text-ink shadow-sm" : "text-ink-muted hover:text-ink"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <section className={`${card} p-5 sm:p-6 lg:col-span-2`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Gross revenue</p>
              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{r.total}</p>
              <p className="mt-2 text-xs text-ink-muted">vs. {r.prev}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-good-soft/50 px-2.5 py-1 text-xs font-bold text-good">
              <TrendingUp className="size-3.5" /> {r.delta}
            </span>
          </div>
          <div className="mt-8 flex h-36 items-end gap-2 sm:h-44 sm:gap-3" role="img" aria-label={`Revenue bars for ${period}`}>
            {r.bars.map((h, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className={`w-full rounded-t-xl transition-colors ${i === r.bars.length - 1 ? "bg-brand" : "bg-soft"}`}
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-ink-muted">{r.labels[i]}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6">
          <section className={`${card} p-5`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-muted">Orders</p>
              <span className="grid size-10 place-items-center rounded-full bg-soft text-brand">
                <Truck className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight">142</p>
            <p className="mt-1 text-xs font-semibold text-good">9 pending dispatch</p>
          </section>
          <section className={`${card} p-5`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-muted">Stock alert</p>
              <span className="grid size-10 place-items-center rounded-full bg-[var(--warn-soft)] text-[var(--warn)]">
                <AlertTriangle className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight">3 items</p>
            <p className="mt-1 text-xs font-semibold text-bad">Action required</p>
          </section>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight">Shortcuts</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shortcuts.map(({ href, label, icon: Icon }) => {
            const body = (
              <>
                <span className="grid size-11 place-items-center rounded-full bg-soft text-brand">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold">{label}</span>
              </>
            );
            const cls = `${card} flex flex-col items-center gap-3 p-5 transition-colors`;
            return href ? (
              <Link key={label} href={href} className={`${cls} hover:border-brand/40 hover:bg-soft/40`}>
                {body}
              </Link>
            ) : (
              <span key={label} aria-disabled className={`${cls} opacity-50`}>
                {body}
              </span>
            );
          })}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-[24px] bg-[var(--warn-soft)]/70 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--warn-soft)] text-[var(--warn)]">
          <AlertTriangle className="size-5" />
        </span>
        <p className="min-w-0 flex-1 text-sm">
          <span className="block font-bold text-ink">Ceramic Diffuser v2</span>
          <span className="text-ink-muted">Only 2 left in stock. Restock advised.</span>
        </p>
        <button className="rounded-full bg-panel px-5 py-2.5 text-sm font-bold text-ink shadow-sm hover:bg-soft">
          Reorder
        </button>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">Recent orders</h2>
          <span className="inline-flex items-center text-sm font-semibold text-brand">
            View all <ChevronRight className="size-4" />
          </span>
        </div>
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {recentOrders.map((o) => (
            <li key={o.id} className={`${card} p-5`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold">
                  #{o.id} <span className="font-normal text-ink-muted">· {o.ago}</span>
                </p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[o.status]}`}>{o.status}</span>
              </div>
              <p className="mt-4 font-semibold">{o.name}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{o.items}</p>
              <div className="mt-4 flex items-end justify-between border-t border-line/40 pt-3">
                <span className="text-xs text-ink-muted">{o.pay}</span>
                <span className="text-lg font-bold">{o.total}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

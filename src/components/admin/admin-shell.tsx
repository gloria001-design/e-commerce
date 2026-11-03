"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, LayoutDashboard, LogOut, PackagePlus, ReceiptText, Store, type LucideIcon } from "lucide-react";

type Item = { href?: string; label: string; icon: LucideIcon };
const items: Item[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products/new", label: "Add product", icon: PackagePlus },
  { label: "Orders", icon: ReceiptText },
  { label: "Analytics", icon: BarChart3 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const title = path.includes("/products/new") ? "Inventory" : "Overview";

  return (
    <div className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line/60 bg-panel p-5 lg:flex">
        <Link href="/admin" className="leading-none">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-brand">Aura</span>
          <span className="text-xl font-bold">Admin</span>
        </Link>

        <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Admin">
          {items.map(({ href, label, icon: Icon }) =>
            href ? (
              <Link
                key={label}
                href={href}
                aria-current={path === href ? "page" : undefined}
                className={`flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  path === href ? "bg-soft text-brand" : "text-ink-muted hover:bg-soft/60 hover:text-ink"
                }`}
              >
                <Icon className="size-5" /> {label}
              </Link>
            ) : (
              <span key={label} aria-disabled className="flex items-center justify-between rounded-full px-3.5 py-2.5 text-sm font-semibold text-ink-muted/45">
                <span className="flex items-center gap-3">
                  <Icon className="size-5" /> {label}
                </span>
                <span className="text-[10px] uppercase tracking-wide">Soon</span>
              </span>
            ),
          )}
        </nav>

        <div className="space-y-1 border-t border-line/60 pt-4">
          <Link href="/" className="flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-semibold text-ink-muted hover:bg-soft/60 hover:text-ink">
            <Store className="size-5" /> View storefront
          </Link>
          <Link href="/vendor" className="flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-semibold text-ink-muted hover:bg-soft/60 hover:text-ink">
            <LayoutDashboard className="size-5" /> Vendor workspace
          </Link>
          <Link href="/admin/sign-in" className="flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-semibold text-ink-muted hover:bg-soft/60 hover:text-ink">
            <LogOut className="size-5" /> Sign out
          </Link>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-line/60 bg-canvas/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <Link href="/admin" className="leading-none">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-brand">Aura</span>
                <span className="font-bold">Admin</span>
              </Link>
            </div>
            <h1 className="hidden text-xl font-bold tracking-tight lg:block">{title}</h1>
            <div className="flex items-center gap-2">
              <button aria-label="Notifications" className="relative grid size-10 place-items-center rounded-full hover:bg-soft">
                <Bell className="size-5" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand" />
              </button>
              <span className="grid size-10 place-items-center rounded-full bg-soft text-sm font-bold text-brand" aria-label="Signed in as admin">
                EV
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-10 lg:py-8">{children}</main>
      </div>

      <nav aria-label="Admin" className="fixed inset-x-0 bottom-0 z-40 border-t border-line/60 bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {[items[0], items[1], { href: "/", label: "Storefront", icon: Store } as Item, items[2]].map(({ href, label, icon: Icon }) => {
            const active = href === path;
            const inner = (
              <>
                <span className={`grid h-7 w-12 place-items-center rounded-full ${active ? "bg-soft" : ""}`}>
                  <Icon className="size-5" />
                </span>
                {label}
              </>
            );
            return (
              <li key={label}>
                {href ? (
                  <Link href={href} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active ? "text-brand" : "text-ink-muted"}`}>
                    {inner}
                  </Link>
                ) : (
                  <span aria-disabled className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-muted/40">
                    {inner}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight, LayoutDashboard, ShieldCheck, Store } from "lucide-react";

export function PortalSwitcher({ active }: { active: "shop" | "vendor" | "admin" }) {
  const items = [
    { id: "shop" as const, href: "/", label: "Shop", detail: "Browse the market", icon: Store },
    { id: "vendor" as const, href: "/vendor", label: "Vendor workspace", detail: "Display your catalog", icon: LayoutDashboard },
    { id: "admin" as const, href: "/admin", label: "Admin console", detail: "Oversee the platform", icon: ShieldCheck },
  ];
  return <div className="grid gap-2 sm:grid-cols-3">{items.map(({ id, href, label, detail, icon: Icon }) => <Link key={id} href={href} className={`group rounded-2xl border p-3 transition-colors ${active === id ? "border-brand/50 bg-brand/10" : "border-line bg-panel hover:border-brand/40"}`}><div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-xl ${active === id ? "bg-brand text-brand-ink" : "bg-soft text-brand"}`}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{label}</span><span className="block truncate text-xs text-ink-muted">{detail}</span></span><ArrowUpRight className="size-4 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div></Link>)}</div>;
}

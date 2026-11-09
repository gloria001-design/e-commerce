"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Package, ShieldCheck, ShoppingBag, UserRound } from "lucide-react";
import { ChangePasswordCard } from "@/components/shared/change-password";
import { useAuth } from "@/hooks/use-auth";
import { endSession } from "@/lib/session";

export default function AccountPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);

  const handleSignOut = async () => { await endSession(); router.push("/"); };

  if (!hydrated) return <p className="py-16 text-center text-sm text-ink-muted">Loading your account…</p>;

  if (!user) {
    return (
      <div className="mx-auto grid max-w-md place-items-center rounded-[24px] border border-dashed border-line px-6 py-16 text-center">
        <UserRound className="size-10 text-ink-muted" />
        <h1 className="mt-4 text-2xl font-bold">Sign in to see your account</h1>
        <Link href="/sign-in" className="mt-6 rounded-full bg-brand px-8 py-3 font-semibold text-brand-ink">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">{user.role === "vendor" ? "Vendor account" : "Customer account"}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your market profile</h1>
        </div>
        <button onClick={handleSignOut} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand">Sign out</button>
      </div>

      <section className="mt-8 rounded-[28px] border border-line bg-panel p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-brand text-2xl font-bold text-brand-ink">{user.name.slice(0, 1).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold">{user.name}</h2>
            <p className="truncate text-sm text-ink-muted">{user.email}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-good-soft px-3 py-1.5 text-xs font-bold text-good"><ShieldCheck className="size-3.5" /> Signed in</span>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section>
          <h2 className="mb-4 text-xl font-bold">Recent orders</h2>
          <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-panel px-6 py-12 text-center">
            <Package className="size-8 text-ink-muted" />
            <p className="mt-3 font-semibold">No orders to show yet</p>
            <p className="mt-1 text-sm text-ink-muted">Order history will appear here once payments are connected.</p>
          </div>
        </section>

        <aside className="space-y-3">
          <Link href="/cart" className="flex items-center justify-between rounded-2xl border border-line bg-panel p-5 text-sm font-bold transition-colors hover:border-brand/50"><span className="flex items-center gap-3"><ShoppingBag className="size-5 text-brand" /> View my bag</span><ArrowRight className="size-4" /></Link>
          <Link href="/" className="flex items-center justify-between rounded-2xl border border-line bg-panel p-5 text-sm font-bold transition-colors hover:border-brand/50"><span className="flex items-center gap-3"><Package className="size-5 text-brand" /> Continue shopping</span><ArrowRight className="size-4" /></Link>
          <ChangePasswordCard admin={user.role === "vendor"} />
        </aside>
      </div>
    </div>
  );
}

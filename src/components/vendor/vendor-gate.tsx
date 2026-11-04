"use client";

import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { VendorShell } from "@/components/vendor/vendor-shell";

export function VendorGate({ children }: { children: React.ReactNode }) {
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const vendorRegistered = useAuth((s) => s.vendorRegistered);

  if (!hydrated) {
    return <div className="grid min-h-screen place-items-center text-sm text-ink-muted">Checking your workspace access…</div>;
  }

  if (user?.role !== "vendor" || !vendorRegistered) {
    return (
      <main className="mx-auto grid min-h-screen max-w-xl place-items-center px-6 text-center">
        <div>
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand"><Store className="size-8" /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-brand">Vendor access required</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Create a vendor account before entering</h1>
          <p className="mt-3 text-ink-muted">The vendor dashboard is only available to vendor accounts. Sign up or sign in as a vendor to manage your store and products.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/sign-up?role=vendor" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-brand-ink">Sign up as vendor <ArrowRight className="size-4" /></Link>
            <Link href="/sign-in?role=vendor" className="rounded-full border border-line px-5 py-3 text-sm font-bold hover:border-brand">Sign in as vendor</Link>
          </div>
          <Link href="/" className="mt-5 inline-block text-sm font-semibold text-ink-muted hover:text-brand">Continue shopping as a user</Link>
        </div>
      </main>
    );
  }

  return <VendorShell>{children}</VendorShell>;
}

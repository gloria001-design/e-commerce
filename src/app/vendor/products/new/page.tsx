"use client";

import Link from "next/link";
import { Store } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { useAuth } from "@/hooks/use-auth";

export default function VendorNewProductPage() {
  const { user, vendorRegistered, hydrated } = useAuth();
  if (!hydrated) return <div className="theme-aura grid min-h-screen place-items-center bg-canvas text-sm text-ink-muted">Checking your workspace access…</div>;
  if (user?.role !== "vendor" || !vendorRegistered) return <main className="theme-aura grid min-h-screen place-items-center bg-canvas px-6 text-center text-ink"><div className="max-w-md"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand"><Store className="size-7" /></span><h1 className="mt-5 text-2xl font-bold">Vendor sign-up required</h1><p className="mt-2 text-ink-muted">Create a vendor account before displaying products.</p><div className="mt-6 flex justify-center gap-3"><Link href="/sign-up?role=vendor" className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-brand-ink">Sign up as vendor</Link><Link href="/" className="rounded-full border border-line px-5 py-3 text-sm font-bold">Back to shop</Link></div></div></main>;
  return <ProductForm backHref="/vendor" backLabel="Back to vendor workspace" />;
}

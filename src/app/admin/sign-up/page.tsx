import Link from "next/link";
import { ShieldCheck, Store } from "lucide-react";
import { AdminSignUpForm } from "@/components/admin/admin-auth-forms";

export const metadata = { title: "Create admin account · Aura" };

export default function AdminSignUpPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-brand to-[#1b1470] p-5 text-white sm:p-6">
          <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/15">
              <Store className="size-7" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Console access</p>
              <h1 className="text-2xl font-bold tracking-tight">Create admin account</h1>
              <p className="mt-1 text-sm text-white/75">Oversee catalog, orders, and store health.</p>
            </div>
          </div>
        </div>
        <div className="mt-5 rounded-[24px] border border-line/50 bg-panel p-5 sm:p-7">
          <AdminSignUpForm />
        </div>
        <p className="mt-4 flex items-center gap-2 rounded-full bg-soft px-4 py-3 text-xs text-ink-muted">
          <ShieldCheck className="size-4 shrink-0 text-brand" /> Protected with 256-bit SSL and role-based access.
        </p>
        <Link href="/" className="mt-4 block text-center text-sm font-semibold text-brand">
          Back to storefront
        </Link>
      </div>
    </div>
  );
}

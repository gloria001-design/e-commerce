import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { AdminSignInForm } from "@/components/admin/admin-auth-forms";

export const metadata = { title: "Admin sign in · Aura" };

export default function AdminSignInPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-soft via-canvas to-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand to-[#1b1470] text-white">
            <LockKeyhole className="size-7" />
          </span>
          <span className="mt-4 inline-block rounded-full bg-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
            Aura Admin Console
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Admin sign in</h1>
          <p className="mt-2 text-ink-muted">Manage inventory, fulfill orders, and monitor sales for your storefront.</p>
        </div>
        <div className="mt-8 rounded-[24px] border border-line/50 bg-panel p-5 sm:p-7">
          <AdminSignInForm />
        </div>
        <Link href="/" className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-soft px-5 py-2.5 text-sm font-semibold text-brand">
          <ArrowLeft className="size-4" /> Back to storefront
        </Link>
      </div>
    </div>
  );
}

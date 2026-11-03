import { Suspense } from "react";
import { SignUpForm } from "@/components/store/auth-forms";
import type { AccountRole } from "@/hooks/use-auth";

export const metadata = { title: "Create account · Aura Market" };

async function SignUpFormWrapper({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const initialRole: AccountRole =
    params.role === "vendor" ? "vendor" : "customer";

  return <SignUpForm initialRole={initialRole} />;
}

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return (
    <>
      <span className="w-fit rounded-full bg-good-soft/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-good">
        Create your Aura access
      </span>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Join Aura Market</h1>
      <p className="mb-6 mt-2 text-ink-muted">
        Choose User to shop or Vendor to create a store and display products.
      </p>

      <Suspense fallback={<div>Loading sign-up form...</div>}>
        <SignUpFormWrapper searchParams={searchParams} />
      </Suspense>
    </>
  );
}
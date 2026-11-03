import { Suspense } from "react";
import { SignInForm } from "@/components/store/auth-forms";
import type { AccountRole } from "@/hooks/use-auth";

export const metadata = { title: "Sign in · Aura Market" };

async function SignInFormWrapper({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const initialRole: AccountRole =
    params.role === "vendor" ? "vendor" : "customer";

  return <SignInForm initialRole={initialRole} />;
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return (
    <>
      <span className="w-fit rounded-full bg-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
        Choose your portal
      </span>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Welcome back</h1>
      <p className="mb-8 mt-2 text-ink-muted">
        Sign in as a shopper or vendor to enter the right Aura Market
        workspace.
      </p>

      <Suspense fallback={<div>Loading sign-in form...</div>}>
        <SignInFormWrapper searchParams={searchParams} />
      </Suspense>
    </>
  );
}
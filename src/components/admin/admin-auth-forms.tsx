"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Building2, KeyRound, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Field, StrengthMeter, passwordScore } from "@/components/shared/field";

export function AdminSignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/admin");
      }}
      className="space-y-5"
    >
      <Field label="Work email" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="admin@aura.shop" autoComplete="email" hint="SSO ready" />
      <Field label="Password" icon={KeyRound} type="password" value={pw} onChange={setPw} autoComplete="current-password" />
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="size-4 accent-[var(--brand)]" /> Remember device
        </label>
        <Link href="#" className="font-semibold text-brand">
          Forgot credentials?
        </Link>
      </div>
      <button className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-semibold text-brand-ink">
        Sign in to dashboard <ArrowRight className="size-5" />
      </button>
      <p className="flex gap-3 text-xs text-ink-muted">
        <ShieldCheck className="size-5 shrink-0 text-brand" /> Role-based access enabled. Authentication events are logged for audit.
      </p>
      <p className="border-t border-line/60 pt-4 text-center text-sm text-ink-muted">
        Don&apos;t have an admin account?{" "}
        <Link href="/admin/sign-up" className="font-bold text-brand">
          Register as admin
        </Link>
      </p>
    </form>
  );
}

export function AdminSignUpForm() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", org: "", pw: "", confirm: "" });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const mismatch = f.confirm.length > 0 && f.confirm !== f.pw;
  const ok = f.pw.length >= 8 && f.pw === f.confirm && passwordScore(f.pw) >= 1;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) router.push("/admin");
      }}
      className="space-y-5"
    >
      <Field label="Store operator name" icon={UserRound} value={f.name} onChange={set("name")} placeholder="e.g. Elena Rostova" autoComplete="name" />
      <Field label="Work email address" icon={Mail} type="email" value={f.email} onChange={set("email")} placeholder="admin@aura.shop" autoComplete="email" />
      <Field label="Store organization" icon={Building2} value={f.org} onChange={set("org")} placeholder="e.g. Aura Flagship" autoComplete="organization" />
      <div>
        <Field label="Master password" icon={Lock} type="password" value={f.pw} onChange={set("pw")} placeholder="Enter master password" autoComplete="new-password" hint="Min. 8 characters" />
        <StrengthMeter password={f.pw} />
      </div>
      <div>
        <Field label="Confirm master password" icon={ShieldCheck} type="password" value={f.confirm} onChange={set("confirm")} placeholder="Repeat master password" autoComplete="new-password" />
        {mismatch && (
          <p role="alert" className="mt-1.5 text-xs text-bad">
            Passwords don&apos;t match.
          </p>
        )}
      </div>
      <button disabled={!ok} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-semibold text-brand-ink disabled:opacity-50">
        Complete registration <ArrowRight className="size-5" />
      </button>
      <p className="text-center text-sm text-ink-muted">
        Already have an admin account?{" "}
        <Link href="/admin/sign-in" className="font-bold text-brand">
          Sign in to Aura Admin
        </Link>
      </p>
    </form>
  );
}

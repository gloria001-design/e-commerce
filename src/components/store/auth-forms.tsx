"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Building2, Lock, Mail, Phone, Store, UserRound } from "lucide-react";
import { Field, StrengthMeter, passwordScore } from "@/components/shared/field";
import { createCustomer, createVendor, loginCustomer, loginVendor } from "@/lib/api";
import { useAuth, type AccountRole } from "@/hooks/use-auth";

function Socials() {
  return <div className="grid grid-cols-2 gap-3"><button type="button" disabled className="cursor-not-allowed rounded-full border border-line bg-panel py-3 text-sm font-semibold text-ink-muted">Apple <span className="text-xs font-normal">Soon</span></button><button type="button" disabled className="cursor-not-allowed rounded-full border border-line bg-panel py-3 text-sm font-semibold text-ink-muted">Google <span className="text-xs font-normal">Soon</span></button></div>;
}

function RoleChoice({ role, selected, onSelect }: { role: AccountRole; selected: boolean; onSelect: () => void }) {
  const vendor = role === "vendor";
  return <button type="button" onClick={onSelect} aria-pressed={selected} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selected ? "border-brand bg-brand/10" : "border-line bg-panel hover:border-brand/40"}`}><span className={`grid size-9 place-items-center rounded-xl ${selected ? "bg-brand text-brand-ink" : "bg-soft text-brand"}`}>{vendor ? <Store className="size-4" /> : <UserRound className="size-4" />}</span><span><span className="block text-sm font-bold">{vendor ? "Vendor" : "User"}</span><span className="block text-xs text-ink-muted">{vendor ? "Sell products on Aura" : "Shop and manage orders"}</span></span></button>;
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="rounded-xl bg-bad/10 px-3 py-2 text-xs font-semibold text-bad">{children}</p>;
}

export function SignInForm({ initialRole = "customer" }: { initialRole?: AccountRole }) {
  const router = useRouter();
  const signIn = useAuth((s) => s.signIn);
  const vendorRegistered = useAuth((s) => s.vendorRegistered);
  const [role, setRole] = useState<AccountRole>(initialRole);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      if (role === "vendor" && !vendorRegistered) throw new Error("Create a vendor account before signing in.");
      if (role === "vendor") await loginVendor(email, pw); else await loginCustomer(email, pw);
      signIn({ name: role === "vendor" ? "Vendor operator" : "Aura member", email, role, storeName: role === "vendor" ? "Northstar Objects" : undefined });
      router.push(role === "vendor" ? "/vendor" : "/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not sign you in. Check your details and try again.");
    } finally { setLoading(false); }
  };

  return <form onSubmit={submit} className="space-y-5"><div><p className="mb-2 text-sm font-bold">Sign in as</p><div className="grid grid-cols-2 gap-2"><RoleChoice role="customer" selected={role === "customer"} onSelect={() => { setRole("customer"); setError(""); }} /><RoleChoice role="vendor" selected={role === "vendor"} onSelect={() => { setRole("vendor"); setError(""); }} /></div></div>{role === "vendor" && <p className="rounded-xl bg-brand/10 px-3 py-2 text-xs font-semibold text-brand">Vendor access uses the backend admin account.</p>}{error && <ErrorMessage>{error} <Link href="/sign-up?role=vendor" className="underline">Create an account</Link></ErrorMessage>}<Field label="Email address" icon={Mail} type="email" value={email} onChange={setEmail} placeholder={role === "vendor" ? "vendor@yourstore.com" : "you@example.com"} autoComplete="email" /><Field label="Password" icon={Lock} type="password" value={pw} onChange={setPw} autoComplete="current-password" hint={<Link href={`/reset-password?role=${role === "vendor" ? "vendor" : "customer"}`} className="font-semibold text-brand">Forgot password?</Link>} /><label className="flex items-center gap-3 text-sm"><input type="checkbox" defaultChecked className="size-5 accent-[var(--brand)]" /> Keep me signed in for 30 days</label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-semibold text-brand-ink disabled:cursor-wait disabled:opacity-60">{loading ? "Signing in…" : role === "vendor" ? "Enter vendor workspace" : "Enter Aura Market"} {!loading && <ArrowRight className="size-5" />}</button><p className="text-center text-xs text-ink-muted">Or continue with</p><Socials /><p className="text-center text-sm text-ink-muted">Don&apos;t have an account? <Link href={role === "vendor" ? "/sign-up?role=vendor" : "/sign-up"} className="font-bold text-brand">Sign up first</Link></p></form>;
}

export function SignUpForm({ initialRole = "customer" }: { initialRole?: AccountRole }) {
  const router = useRouter();
  const signUp = useAuth((s) => s.signUp);
  const [mode, setMode] = useState<AccountRole>(initialRole);
  const [f, setF] = useState({ name: "", email: "", phone: "", pw: "", store: "" });
  const [agree, setAgree] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const set = (key: keyof typeof f) => (value: string) => setF((current) => ({ ...current, [key]: value }));
  const validPhone = /^\d{7,15}$/.test(f.phone.replace(/\D/g, ""));
  const ok = Boolean(agree && passwordScore(f.pw) >= 1 && f.pw.length >= 8 && f.name.trim() && f.email.trim() && validPhone && (mode === "customer" || f.store.trim()));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!ok) return; setError(""); setLoading(true);
    try {
      if (mode === "vendor") await createVendor({ name: f.name, storeName: f.store, phoneNumber: f.phone.replace(/\D/g, ""), email: f.email, password: f.pw });
      else await createCustomer({ fullName: f.name, email: f.email, password: f.pw, phoneNumber: f.phone.replace(/\D/g, "") });
      signUp({ name: f.name, email: f.email, phone: f.phone, role: mode, storeName: mode === "vendor" ? f.store : undefined });
      router.push(`/verify?role=${mode === "vendor" ? "vendor" : "customer"}&email=${encodeURIComponent(f.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not create your account. Please try again.");
    } finally { setLoading(false); }
  };

  return <form onSubmit={submit} className="space-y-5"><div><p className="mb-2 text-sm font-bold">Create account as</p><div className="grid grid-cols-2 gap-2"><RoleChoice role="customer" selected={mode === "customer"} onSelect={() => setMode("customer")} /><RoleChoice role="vendor" selected={mode === "vendor"} onSelect={() => setMode("vendor")} /></div></div>{error && <ErrorMessage>{error}</ErrorMessage>}<Socials /><p className="text-center text-xs text-ink-muted">Or sign up with email</p><Field label={mode === "vendor" ? "Your name" : "Full name"} icon={UserRound} value={f.name} onChange={set("name")} placeholder="Sloane Miller" autoComplete="name" />{mode === "vendor" && <Field label="Store name" icon={Building2} value={f.store} onChange={set("store")} placeholder="Northstar Objects" autoComplete="organization" />}<Field label="Email address" icon={Mail} type="email" value={f.email} onChange={set("email")} placeholder="sloane@example.com" autoComplete="email" /><Field label="Mobile number" icon={Phone} type="tel" value={f.phone} onChange={set("phone")} placeholder="(555) 234-8901" autoComplete="tel" required /><div><Field label="Password" icon={Lock} type="password" value={f.pw} onChange={set("pw")} placeholder="Create a secure passphrase" autoComplete="new-password" /><StrengthMeter password={f.pw} /></div><label className="flex items-start gap-3 text-xs text-ink-muted"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" /><span>I agree to Aura Market&apos;s <Link href="/sign-up" className="font-semibold underline">Terms</Link> and <Link href="/sign-up" className="font-semibold underline">Privacy Notice</Link>.</span></label><button disabled={!ok || loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Creating account…" : mode === "vendor" ? "Create vendor account" : "Create user account"} {!loading && <ArrowRight className="size-5" />}</button><p className="text-center text-sm text-ink-muted">Already have an account? <Link href="/sign-in" className="font-bold text-brand">Sign in</Link></p></form>;
}

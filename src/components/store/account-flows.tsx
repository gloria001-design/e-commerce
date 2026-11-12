"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, MailCheck } from "lucide-react";
import { PASSWORD_HINT, meetsPasswordRule } from "@/components/shared/field";
import { resetPassword, requestPasswordReset, resendCustomerOtp, resendVendorOtp, verifyCustomer, verifyVendor } from "@/lib/api";

const input = "h-12 w-full rounded-xl border border-line bg-canvas px-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
const errText = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-[24px] border border-line/50 bg-panel p-6 sm:p-8">
      <span className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand"><MailCheck className="size-6" /></span>
      <h1 className="mt-5 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink-muted">Use the details sent to your email to finish securing your account.</p>
      {children}
    </div>
  );
}

export function VerifyForm() {
  const params = useSearchParams();
  const router = useRouter();
  const admin = params.get("role") === "vendor";
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setStatus(""); setBusy(true);
    try {
      if (admin) await verifyVendor(email, otp); else await verifyCustomer(email, otp);
      setVerified(true); setStatus("Email verified. You can sign in now.");
    } catch (err) { setError(errText(err, "That code could not be verified.")); } finally { setBusy(false); }
  };
  const resend = async () => {
    setError(""); setStatus("");
    try {
      if (admin) await resendVendorOtp(email); else await resendCustomerOtp(email);
      setStatus("A fresh code is on its way.");
    } catch (err) { setError(errText(err, "We could not resend the code.")); }
  };

  return (
    <Shell title="Verify your email">
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">Email<input className={`${input} mt-1`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="block text-sm font-semibold">6-digit code<input className={`${input} mt-1 tracking-[0.5em]`} inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required /></label>
        {error && <p role="alert" className="rounded-xl bg-bad/10 px-3 py-2 text-sm font-semibold text-bad">{error}</p>}
        {status && <p className="rounded-xl bg-good-soft px-3 py-2 text-sm font-semibold text-good">{status}</p>}
        <button disabled={busy} className="w-full rounded-full bg-brand py-3.5 font-bold text-brand-ink disabled:opacity-60">{busy ? "Verifying…" : "Verify account"}</button>
        <button type="button" onClick={resend} className="w-full rounded-full bg-soft py-3 text-sm font-bold text-brand">Resend code</button>
        {verified && <button type="button" onClick={() => router.push(`/sign-in?role=${admin ? "vendor" : "customer"}`)} className="w-full text-sm font-bold text-ink-muted">Go to sign in</button>}
      </form>
    </Shell>
  );
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const admin = params.get("role") === "vendor";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    try {
      await requestPasswordReset(email, admin);
      setSent(true); setMessage("Reset request sent. Enter your new password below once your email code is confirmed.");
    } catch (err) { setError(errText(err, "We could not start the reset.")); }
  };
  const reset = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!meetsPasswordRule(password)) return setError(`Password needs ${PASSWORD_HINT}`);
    try { await resetPassword(email, password, admin); setMessage("Password updated. You can sign in with it now."); }
    catch (err) { setError(errText(err, "We could not update the password.")); }
  };

  return (
    <Shell title="Reset your password">
      <div className="mt-6 space-y-4">
        <form onSubmit={send} className="space-y-3">
          <label className="block text-sm font-semibold">Account email<input className={`${input} mt-1`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <button className="w-full rounded-full bg-soft py-3 font-bold text-brand">Send reset request</button>
        </form>
        <form onSubmit={reset} className="space-y-3 border-t border-line/60 pt-4">
          <label className="block text-sm font-semibold">New password<input className={`${input} mt-1`} type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button disabled={!sent} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-bold text-brand-ink disabled:opacity-40"><LockKeyhole className="size-4" /> Update password</button>
        </form>
        {error && <p role="alert" className="rounded-xl bg-bad/10 px-3 py-2 text-sm font-semibold text-bad">{error}</p>}
        {message && <p className="rounded-xl bg-good-soft px-3 py-2 text-sm font-semibold text-good">{message}</p>}
        <Link href={`/sign-in?role=${admin ? "vendor" : "customer"}`} className="block text-center text-sm font-bold text-ink-muted">Back to sign in</Link>
      </div>
    </Shell>
  );
}

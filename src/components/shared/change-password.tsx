"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { changePassword } from "@/lib/api";

const input = "h-11 w-full rounded-xl border border-line bg-canvas px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function ChangePasswordCard({ admin = false }: { admin?: boolean }) {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setOk(""); setError(""); setBusy(true);
    try {
      await changePassword(oldPassword, newPassword, admin);
      setOk("Password updated."); setOld(""); setNew("");
    } catch (err) { setError(err instanceof Error ? err.message : "We could not change your password."); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-panel p-5">
      <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand"><KeyRound className="size-5" /></span><p className="font-bold">Change password</p></div>
      <div className="mt-4 space-y-3">
        <input className={input} type="password" autoComplete="current-password" placeholder="Current password" value={oldPassword} onChange={(e) => setOld(e.target.value)} required aria-label="Current password" />
        <input className={input} type="password" autoComplete="new-password" placeholder="New password (8+ characters)" minLength={8} value={newPassword} onChange={(e) => setNew(e.target.value)} required aria-label="New password" />
      </div>
      {error && <p role="alert" className="mt-3 rounded-xl bg-bad/10 px-3 py-2 text-xs font-semibold text-bad">{error}</p>}
      {ok && <p role="status" className="mt-3 rounded-xl bg-good-soft px-3 py-2 text-xs font-semibold text-good">{ok}</p>}
      <button disabled={busy} className="mt-4 w-full rounded-full bg-soft py-2.5 text-sm font-bold text-brand disabled:opacity-60">{busy ? "Updating…" : "Update password"}</button>
    </form>
  );
}

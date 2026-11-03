"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "password" | "tel";
  placeholder?: string;
  hint?: React.ReactNode;
  autoComplete?: string;
  required?: boolean;
};

export function Field({ label, icon: Icon, value, onChange, type = "text", placeholder, hint, autoComplete, required = true }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
        <label htmlFor={id} className="font-semibold">{label}</label>
        {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-4 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        {Icon && <Icon className="size-5 shrink-0 text-ink-muted" aria-hidden />}
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-ink-muted/60"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="text-ink-muted">
            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

/** 0-3 score from length, a number and a symbol. */
export function passwordScore(pw: string) {
  return [pw.length >= 8, /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
}

export function StrengthMeter({ password }: { password: string }) {
  const score = passwordScore(password);
  const labels = ["Idle", "Weak", "Good", "Strong"];
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full ${score >= n ? "bg-brand" : "bg-line/60"}`} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-muted">
        Strength: {labels[score]} · 8+ chars, a number and a symbol
      </p>
    </div>
  );
}

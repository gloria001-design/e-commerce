"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export function FlashSale() {
  const [left, setLeft] = useState(4 * 3600 + 32 * 60 + 12);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#ffdbcc] text-[#7e3000]"><Zap className="size-5" /></span>
        <p className="flex-1 font-semibold">Flash Sale ends in</p>
        <span className="rounded-lg bg-soft px-2.5 py-1 font-mono text-sm font-bold tabular-nums" aria-label="Time remaining">
          {pad(Math.floor(left / 3600))}:{pad(Math.floor((left % 3600) / 60))}:{pad(left % 60)}
        </span>
      </div>
      <div className="mt-4 flex justify-between text-xs text-ink-muted"><span>74% claimed</span><span>Only 18 left at this tier</span></div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-soft"><div className="h-full w-[74%] rounded-full bg-[#a44100]" /></div>
    </div>
  );
}

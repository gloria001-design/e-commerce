"use client";

import { MapPin, RotateCcw, Store, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { money } from "@/lib/catalog";
import { ZONES, getDeliveryOptions } from "@/lib/delivery";

const KEY = "aura-delivery-location";
const fmt = (d: Date) => d.toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" });
const select = "h-11 w-full rounded-xl border border-line bg-soft px-3 text-sm font-semibold text-ink outline-none focus:border-brand disabled:opacity-50";

/** Jumia-style "Delivery & Returns": pick a location, see fee and arrival window per delivery method. */
export function DeliveryEstimator({ orderTotal, disabled }: { orderTotal: number; disabled?: boolean }) {
  const [region, setRegion] = useState("");
  const [area, setArea] = useState("");

  // Remember the shopper's location between products. Storage can be unavailable, so never rely on it.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (saved && ZONES.some((z) => z.region === saved.region)) { setRegion(saved.region); setArea(saved.area ?? ""); }
    } catch {}
  }, []);
  const save = (r: string, a: string) => { setRegion(r); setArea(a); try { localStorage.setItem(KEY, JSON.stringify({ region: r, area: a })); } catch {} };

  const zone = ZONES.find((z) => z.region === region);
  const options = useMemo(() => getDeliveryOptions(region, orderTotal), [region, orderTotal]);

  return (
    <section aria-labelledby="delivery-h" className="mt-6 overflow-hidden rounded-[20px] border border-line/60 bg-panel">
      <div className="p-4 sm:p-5">
        <h2 id="delivery-h" className="flex items-center gap-2 text-base font-bold"><MapPin className="size-5 text-brand" />Delivery &amp; returns</h2>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <label className="block"><span className="sr-only">Region</span>
            <select value={region} onChange={(e) => save(e.target.value, "")} className={select}>
              <option value="">Choose your region</option>
              {ZONES.map((z) => <option key={z.region}>{z.region}</option>)}
            </select>
          </label>
          <label className="block"><span className="sr-only">Area</span>
            <select value={area} onChange={(e) => save(region, e.target.value)} disabled={!zone} className={select}>
              <option value="">{zone ? "Choose your area" : "Area"}</option>
              {zone?.areas.map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
        </div>
      </div>

      {options.length === 0 ? (
        <p className="border-t border-line/60 px-4 py-3.5 text-sm text-ink-muted sm:px-5">Select where you want it delivered to see the fee and arrival date.</p>
      ) : (
        <ul className="divide-y divide-line/60 border-t border-line/60" aria-live="polite">
          {options.map((o) => {
            const Icon = o.kind === "door" ? Truck : Store;
            return (
              <li key={o.kind} className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                <Icon className="mt-0.5 size-5 shrink-0 text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{o.label}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{disabled ? "Currently unavailable" : <>Arrives between <b className="text-ink">{fmt(o.from)}</b> and <b className="text-ink">{fmt(o.to)}</b></>}</p>
                  {o.kind === "pickup" && area && <p className="mt-0.5 text-xs text-ink-muted">Collect from a pickup station near {area}.</p>}
                </div>
                <p className={`shrink-0 text-sm font-bold ${o.fee === 0 ? "text-good" : ""}`}>{o.fee === 0 ? "Free" : money(o.fee)}</p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-start gap-3 border-t border-line/60 px-4 py-3.5 sm:px-5">
        <RotateCcw className="mt-0.5 size-5 shrink-0 text-brand" />
        <p className="text-sm"><b>Easy returns</b><span className="block text-ink-muted">Return within 30 days if it isn&apos;t right.</span></p>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ImagePlus, Minus, Plus, Rocket, Wand2, X } from "lucide-react";

const CATEGORIES = ["Desk Setup & Peripherals", "Audio", "Wearables", "Living", "Health"];
const FINISHES = ["Red Linear", "Brown Tactile", "Blue Clicky"];

const card = "rounded-[20px] border border-line/50 bg-panel p-4 sm:p-5";
const input = "h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function Label({ children, hint }: { children: React.ReactNode; hint?: React.ReactNode }) {
  return <div className="mb-1.5 flex justify-between text-sm"><span className="font-semibold">{children}</span>{hint && <span className="text-xs text-ink-muted">{hint}</span>}</div>;
}

export function ProductForm({ backHref = "/admin", backLabel = "Back to overview" }: { backHref?: string; backLabel?: string }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sku, setSku] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [sale, setSale] = useState("");
  const [cost, setCost] = useState("");
  const [track, setTrack] = useState(true);
  const [stock, setStock] = useState(45);
  const [colors, setColors] = useState(["Midnight Black", "Slate Gray"]);
  const [newColor, setNewColor] = useState("");
  const [finish, setFinish] = useState(FINISHES[1]);
  const [files, setFiles] = useState<{ url: string; name: string }[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const p = parseFloat(price) || 0;
  const s = parseFloat(sale) || 0;
  const c = parseFloat(cost) || 0;
  const selling = s > 0 ? s : p;
  const off = p > 0 && s > 0 && s < p ? Math.round(((p - s) / p) * 100) : 0;
  const profit = selling - c;
  const margin = selling > 0 && c > 0 ? Math.round((profit / selling) * 100) : 0;

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("Add a product title first.");
    if (p <= 0) return setError("Enter a regular price greater than 0.");
    if (s > 0 && s >= p) return setError("Sale price must be lower than the regular price.");
    setError("");
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto grid max-w-md place-items-center rounded-[24px] border border-line/50 bg-panel px-6 py-14 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-good-soft text-good"><Check className="size-7" /></span>
        <h2 className="mt-4 text-2xl font-bold">Ready to publish</h2>
        <p className="mt-1 text-ink-muted">“{title}” passed validation. Saving to a database isn&apos;t connected yet.</p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => setDone(false)} className="rounded-full border border-line px-6 py-3 text-sm font-semibold">Keep editing</button>
          <Link href={backHref} className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-ink">{backLabel}</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={publish} className="pb-20 lg:pb-0">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Add product</h2>
          <p className="text-sm text-ink-muted">Draft · changes are kept while this page is open</p>
        </div>
        <div className="fixed inset-x-0 bottom-[68px] z-30 flex gap-3 border-t border-line/60 bg-panel/95 p-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0">
          <Link href="/admin" className="grid flex-1 place-items-center rounded-full border border-line px-6 py-3 text-sm font-semibold lg:flex-none">Discard</Link>
          <button className="flex flex-[2] items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-ink lg:flex-none"><Rocket className="size-4" /> Publish to Store</button>
        </div>
      </div>
      {error && <p role="alert" className="mb-4 rounded-full bg-bad/10 px-4 py-3 text-sm font-semibold text-bad">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-4">
          <section className={card}>
            <h3 className="mb-4 font-bold">General Information</h3>
            <div className="space-y-4">
              <div><Label hint={`${title.length}/80`}>Product title</Label><input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Apex Low-Profile Mechanical Keyboard" className={input} /></div>
              <div><Label>Category</Label><select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select></div>
              <div>
                <Label hint={<button type="button" onClick={() => setSku(`SKU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)} className="inline-flex items-center gap-1 font-semibold text-brand"><Wand2 className="size-3" /> Generate</button>}>SKU code</Label>
                <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="DSK-KB-APEX01" className={input} />
              </div>
              <div><Label hint={`${desc.length}/600`}>Overview description</Label><textarea value={desc} maxLength={600} onChange={(e) => setDesc(e.target.value)} rows={5} placeholder="Machined aluminum top-plate with pre-lubricated linear switches…" className={`${input} h-auto py-3`} /></div>
            </div>
          </section>

          <section className={card}>
            <h3 className="mb-4 font-bold">Pricing &amp; Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Regular price</Label><input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$ 169.00" className={input} /></div>
              <div><Label hint={off ? `${off}% off` : undefined}>Sale price</Label><input inputMode="decimal" value={sale} onChange={(e) => setSale(e.target.value)} placeholder="$ 149.00" className={input} /></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-soft/60 p-3">
              <div><Label>Cost per item</Label><input inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="$ 58.40" className={`${input} bg-panel`} /></div>
              <div className="text-sm"><p className="text-ink-muted">Est. gross margin</p><p className="mt-1 text-lg font-bold text-good">{c > 0 && selling > 0 ? `$${profit.toFixed(2)} (${margin}%)` : "—"}</p></div>
            </div>
            <label className="mt-5 flex items-center justify-between gap-3">
              <span><span className="block font-semibold">Track stock quantity</span><span className="text-xs text-ink-muted">Alert when low on inventory</span></span>
              <input type="checkbox" role="switch" checked={track} onChange={(e) => setTrack(e.target.checked)} className="size-6 accent-[var(--brand)]" />
            </label>
            {track && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-line px-3 py-2">
                <span className="text-sm text-ink-muted">Warehouse stock</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setStock(Math.max(0, stock - 1))} aria-label="Decrease stock" className="grid size-9 place-items-center rounded-lg bg-soft"><Minus className="size-4" /></button>
                  <input aria-label="Units" inputMode="numeric" value={stock} onChange={(e) => setStock(Math.max(0, parseInt(e.target.value, 10) || 0))} className="w-14 bg-transparent text-center font-bold outline-none" />
                  <button type="button" onClick={() => setStock(stock + 1)} aria-label="Increase stock" className="grid size-9 place-items-center rounded-lg bg-soft"><Plus className="size-4" /></button>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <section className={card}>
            <div className="mb-4 flex items-center justify-between"><h3 className="font-bold">Product Visuals</h3><span className="rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-brand">{files.length} / 6 added</span></div>
            <div className="grid grid-cols-3 gap-3">
              {files.map((f, i) => (
                <div key={f.url} className="relative aspect-square overflow-hidden rounded-xl bg-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.name} className="size-full object-cover" />
                  {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-good px-2 py-0.5 text-[10px] font-bold text-brand-ink">Cover</span>}
                  <button type="button" onClick={() => { URL.revokeObjectURL(f.url); setFiles(files.filter((x) => x !== f)); }} aria-label={`Remove ${f.name}`} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-ink/70 text-canvas"><X className="size-3" /></button>
                </div>
              ))}
              {files.length < 6 && (
                <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-line text-ink-muted hover:border-brand hover:text-brand">
                  <span className="grid place-items-center gap-1 text-xs font-semibold"><ImagePlus className="size-6" /> Add photo</span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
                    const next = Array.from(e.target.files ?? []).slice(0, 6 - files.length).map((file) => ({ url: URL.createObjectURL(file), name: file.name }));
                    setFiles([...files, ...next]);
                    e.target.value = "";
                  }} />
                </label>
              )}
            </div>
          </section>

          <section className={card}>
            <h3 className="mb-4 font-bold">Variants &amp; Finishes</h3>
            <Label>Colorway options</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-sm font-medium">{c}<button type="button" onClick={() => setColors(colors.filter((x) => x !== c))} aria-label={`Remove ${c}`}><X className="size-3.5" /></button></span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={newColor} onChange={(e) => setNewColor(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newColor.trim()) { setColors([...colors, newColor.trim()]); setNewColor(""); } } }} placeholder="Add colour" className={`${input} h-10 text-sm`} />
              <button type="button" onClick={() => { if (newColor.trim()) { setColors([...colors, newColor.trim()]); setNewColor(""); } }} className="rounded-xl bg-soft px-4 text-sm font-semibold text-brand">Add</button>
            </div>
            <div className="mt-5"><Label>Switch option</Label>
              <div className="grid grid-cols-3 gap-2">
                {FINISHES.map((f) => <button key={f} type="button" aria-pressed={finish === f} onClick={() => setFinish(f)} className={`rounded-xl px-2 py-2.5 text-xs font-semibold ${finish === f ? "bg-ink text-canvas" : "bg-soft text-ink-muted"}`}>{f}</button>)}
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}

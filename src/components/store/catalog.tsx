"use client";

import { Grid2x2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductTile } from "@/components/store/product-tile";
import { CATEGORIES, products } from "@/lib/catalog";
import type { Category } from "@/types/catalog";

export function Catalog({ query = "" }: { query?: string }) {
  const [cat, setCat] = useState<Category | "All">("All");
  const list = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((p) => (cat === "All" || p.category === cat) && (!q || p.name.toLowerCase().includes(q)));
  }, [cat, query]);

  return (
    <section id="picks" className="scroll-mt-24">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Categories">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold ${cat === c ? "bg-brand text-brand-ink" : "bg-panel text-ink-muted ring-1 ring-line/60"}`}>
            {c === "All" && <Grid2x2 className="size-4" />}
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">Curated Picks</h2>
        <span className="text-sm font-semibold text-brand">{list.length} {list.length === 1 ? "item" : "items"}{query && ` for “${query}”`}</span>
      </div>

      {list.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductTile key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="mt-6 grid place-items-center rounded-[20px] border border-dashed border-line p-12 text-center">
          <Search className="size-8 text-ink-muted" />
          <p className="mt-3 font-semibold">Nothing matches that search</p>
          <button onClick={() => setCat("All")} className="mt-3 text-sm font-semibold text-brand">Show all products</button>
        </div>
      )}
    </section>
  );
}

import { Suspense } from "react";
import { CartBar } from "@/components/store/cart-bar";
import { Catalog } from "@/components/store/catalog";
import { FlashSale } from "@/components/store/flash-sale";
import { Hero } from "@/components/store/hero";

function CatalogFallback() {
  return (
    <section id="picks" className="scroll-mt-24 animate-pulse">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-24 rounded-full bg-soft" />
        ))}
      </div>
      <div className="mt-6 h-7 w-40 rounded bg-soft" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] rounded-[20px] bg-soft" />
        ))}
      </div>
    </section>
  );
}

async function CatalogFromSearch({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return <Catalog query={q} />;
}

export default function StorefrontPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr] lg:gap-6">
        <Hero />
        <div className="lg:flex lg:flex-col lg:justify-end">
          <FlashSale />
        </div>
      </div>
      <Suspense fallback={<CatalogFallback />}>
        <CatalogFromSearch searchParams={searchParams} />
      </Suspense>
      <CartBar />
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Sparkles, Store, Truck } from "lucide-react";
export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/20 bg-[#0d1a2b] p-6 text-white shadow-[0_0_70px_rgb(34_211_238_/_0.08)] sm:p-10 lg:flex lg:min-h-[350px] lg:flex-col lg:justify-center lg:p-14">
      <div
        aria-hidden
        className="absolute -right-16 -top-24 size-80 rounded-full bg-cyan-300/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/3 size-96 rounded-full bg-indigo-500/10 blur-3xl"
      />
      <div className="relative flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
          <Sparkles className="size-3.5" /> The independent market
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white/75">
          <Store className="size-3.5" /> Built for makers
        </span>
      </div>
      <h1 className="relative mt-5 max-w-3xl text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
        Good things, <span className="text-brand">all in one place.</span>
      </h1>
      <p className="relative mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
        Shop thoughtful essentials from independent vendors, or bring your own
        bestsellers to a marketplace designed to help them stand out.
      </p>
      <div className="relative mt-7 flex flex-wrap gap-3">
        <Link
          href="/#picks"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-ink"
        >
          Explore the market <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/vendor"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          <Store className="size-4" /> Start selling
        </Link>
      </div>
      <p className="relative mt-6 flex items-center gap-2 text-xs text-slate-400">
        <Truck className="size-4 text-brand" /> Free shipping over $150 · 30-day
        returns
      </p>
    </section>
  );
}

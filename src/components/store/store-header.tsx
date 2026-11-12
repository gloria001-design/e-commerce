"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  Search,
  ShoppingBag,
  Store,
  UserRound,
} from "lucide-react";
import { selectCount, useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

export function StoreHeader() {
  const router = useRouter();
  const count = useCart(selectCount);
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const [q, setQ] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/?q=${encodeURIComponent(q.trim())}#picks` : "/");
    setMobileSearch(false);
  };
  const box = (
    <form
      onSubmit={search}
      role="search"
      className="flex items-center gap-3 rounded-full border border-line bg-soft/70 px-4 focus-within:border-brand/70"
    >
      <Search className="size-5 shrink-0 text-ink-muted" aria-hidden />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the market…"
        aria-label="Search products"
        className="h-11 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ink-muted/70"
      />
    </form>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-20 lg:gap-8 lg:px-8">
        <Link href="/" className="group shrink-0 leading-none">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-brand">
            <span className="size-2 rounded-full bg-brand shadow-[0_0_12px_var(--brand)]" />
            Aura
          </span>
          <span className="text-xl font-bold tracking-tight text-ink">
            Market
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
          <Link href="/" className="text-brand">
            Shop
          </Link>
          <Link
            href="/#picks"
            className="text-ink-muted transition-colors hover:text-ink"
          >
            Discover
          </Link>
          <Link
            href="/sign-up?role=vendor"
            className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-brand"
          >
            <Store className="size-4" /> Sell on Aura
          </Link>
        </nav>
        <div className="hidden flex-1 md:block lg:max-w-md">{box}</div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setMobileSearch(!mobileSearch)}
            aria-label="Search"
            className="grid size-10 place-items-center rounded-full hover:bg-soft md:hidden"
          >
            <Search className="size-5" />
          </button>
          <Link
            href="/cart"
            aria-label={`Cart, ${count} items`}
            className="relative grid size-10 place-items-center rounded-full hover:bg-soft"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-brand-ink">
                {count}
              </span>
            )}
          </Link>
          {!hydrated ? (
            <div className="h-10 w-24" aria-hidden />
          ) : user ? (
            <Link
              href={user.role === "vendor" ? "/vendor" : "/account"}
              aria-label="Account"
              className="group flex items-center gap-2 rounded-full bg-soft px-2 py-1.5 sm:pl-1.5 sm:pr-3"
            >
              <span className="grid size-8 place-items-center rounded-full bg-brand text-brand-ink">
                <UserRound className="size-4" />
              </span>
              <span className="hidden text-xs font-semibold sm:block">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDown className="hidden size-3.5 text-ink-muted sm:block" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="hidden rounded-full px-3 py-2 text-sm font-bold text-ink-muted hover:text-brand sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-brand px-3.5 py-2 text-sm font-bold text-brand-ink sm:px-4"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
      {mobileSearch && (
        <div className="border-t border-line/60 px-4 pb-3 md:hidden">{box}</div>
      )}
    </header>
  );
}

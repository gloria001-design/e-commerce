import Link from "next/link";

export default function NotFound() {
  return <main className="theme-aura grid min-h-screen place-items-center bg-canvas px-6 text-center text-ink"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Aura Market</p><h1 className="mt-3 text-4xl font-bold">That page moved.</h1><p className="mt-2 text-ink-muted">The market is still open — head back to the storefront.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-bold text-brand-ink">Back to shop</Link></div></main>;
}

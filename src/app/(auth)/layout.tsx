import Link from "next/link";
import { ArrowLeft, Package, ShieldCheck, Store } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-aura min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand to-[#1b1470] p-12 text-white lg:flex">
        <div aria-hidden className="absolute -bottom-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <Link href="/" className="relative text-2xl font-bold tracking-tight">AURA</Link>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Everything you love, one tap away.</h2>
          <ul className="mt-8 space-y-4 text-white/85">
            <li className="flex items-center gap-3"><Package className="size-5" /> Free shipping on orders over $150</li>
            <li className="flex items-center gap-3"><ShieldCheck className="size-5" /> 30-day returns on every order</li>
            <li className="flex items-center gap-3"><Store className="size-5" /> Open a vendor account and list your products</li>
          </ul>
        </div>
        <p className="relative text-sm text-white/60">Encrypted and secure</p>
      </aside>
      <div className="flex min-h-screen flex-col px-4 py-5 sm:px-8">
        <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink"><ArrowLeft className="size-5" /> Back to shop</Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">{children}</div>
      </div>
    </div>
  );
}

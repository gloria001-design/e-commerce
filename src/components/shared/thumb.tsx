import { Backpack, Headphones, Lamp, Package, Watch, type LucideIcon } from "lucide-react";
import type { Product } from "@/types/catalog";

function iconFor(p: Pick<Product, "name" | "category">): LucideIcon {
  const n = p.name.toLowerCase();
  if (n.includes("watch")) return Watch;
  if (n.includes("headphone") || n.includes("speaker") || n.includes("keyboard")) return Headphones;
  if (n.includes("lamp") || n.includes("light")) return Lamp;
  if (n.includes("backpack") || n.includes("bag")) return Backpack;
  return Package;
}

/**
 * Product photo, or a placeholder icon. Photos come from the backend on any host, so this is a plain <img>:
 * next/image would throw for every host not listed in next.config.
 */
export function Thumb({ product, className = "" }: { product: Pick<Product, "name" | "category" | "image">; className?: string }) {
  const Icon = iconFor(product);
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-soft text-brand/40 ${className}`}>
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.name} loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : (
        <Icon className="size-1/3" strokeWidth={1.25} aria-hidden />
      )}
    </div>
  );
}

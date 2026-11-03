import Image from "next/image";
import { Backpack, Headphones, Lamp, Package, Watch, type LucideIcon } from "lucide-react";
import type { Product } from "@/types/catalog";

function iconFor(p: Pick<Product, "name" | "category">): LucideIcon {
  const n = p.name.toLowerCase();
  if (n.includes("watch")) return Watch;
  if (n.includes("headphone") || n.includes("speaker") || n.includes("keyboard")) return Headphones;
  if (n.includes("lamp") || n.includes("light")) return Lamp;
  if (n.includes("backpack")) return Backpack;
  return Package;
}

/** Product photo, or a neutral placeholder until you add an image in /public. */
export function Thumb({ product, className = "" }: { product: Pick<Product, "name" | "category" | "image">; className?: string }) {
  const Icon = iconFor(product);
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-soft text-brand/40 ${className}`}>
      {product.image ? (
        <Image src={product.image} alt={product.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
      ) : (
        <Icon className="size-1/3" strokeWidth={1.25} aria-hidden />
      )}
    </div>
  );
}

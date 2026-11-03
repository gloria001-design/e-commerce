import type { Category, Product } from "@/types/catalog";

export const CATEGORIES: Category[] = ["Audio & Tech", "Minimal Home", "Carry & Style"];

export const products: Product[] = [
  { id: "p1", name: "Aura Studio Wireless ANC Headphones", category: "Audio & Tech", price: 189, oldPrice: 249, rating: 4.9, reviews: 328, badge: "Bestseller", color: "Matte Midnight Blue" },
  { id: "p2", name: "Nordic Ceramic Ambient Lamp", category: "Minimal Home", price: 64, rating: 4.8, reviews: 142, badge: "Staff Pick", color: "Warm Terracotta Finish" },
  { id: "p3", name: "Minimalist Matte Leather Backpack", category: "Carry & Style", price: 128, rating: 4.7, reviews: 95, color: "Obsidian Black" },
  { id: "p4", name: "Precision Chrono Watch", category: "Carry & Style", price: 210, rating: 4.8, reviews: 410, badge: "Limited", color: "Silver / Steel" },
  { id: "p5", name: "Pebble 360 Speaker", category: "Audio & Tech", price: 120, rating: 4.6, reviews: 211, color: "Brushed Aluminium" },
  { id: "p6", name: "Arc Mechanical Keyboard", category: "Audio & Tech", price: 220, rating: 4.7, reviews: 88, badge: "New", color: "Sage / Cream" },
  { id: "p7", name: "Oak Desk Organiser", category: "Minimal Home", price: 46, rating: 4.5, reviews: 63, color: "Natural Oak" },
  { id: "p8", name: "Sol Smart Ambient Light", category: "Minimal Home", price: 145, rating: 4.6, reviews: 120, color: "Ceramic White" },
];

export const FREE_SHIPPING_AT = 150;
export const PROMO_CODES: Record<string, number> = { SUMMER30: 0.1, AURA15: 0.15 };
export const money = (n: number) => `$${n.toFixed(2)}`;

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function productBlurb(p: Product) {
  return `${p.name} in ${p.color}. Curated for everyday use with thoughtful materials, free shipping over $${FREE_SHIPPING_AT}, and a 30-day return window.`;
}

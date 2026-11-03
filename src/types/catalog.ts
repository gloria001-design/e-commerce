export type Category = "Audio & Tech" | "Minimal Home" | "Carry & Style";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  color: string;
  /** Path inside /public, e.g. "/products/headphones.jpg". Leave empty for a placeholder icon. */
  image?: string;
};

export type CartLine = { product: Product; qty: number };

export type Product = {
  id: string;
  name: string;
  /** Free text from the backend (vendors choose it), so the shop tabs are built from it. */
  category: string;
  /** Major units (the backend stores cents; see productToCatalog). */
  price: number;
  oldPrice?: number;
  badge?: string;
  color: string;
  image?: string;
  /** Every photo the vendor uploaded (image is the first). */
  images?: string[];
  stock: number;
  description?: string;
};

/** itemId is the backend cart-item id used by update/remove. */
export type CartLine = { itemId: string; product: Product; qty: number };

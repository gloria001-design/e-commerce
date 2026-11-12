export const FREE_SHIPPING_AT = 150;
export const money = (n: number) => `$${n.toFixed(2)}`;

/** Backend tax on an order: 7.2% of the subtotal, rounded to the nearest integer (see Swagger "Order"). */
export const TAX_RATE = 0.072;

/** Category values come from the backend enum; this maps them to display names. Unknown values are spaced out. */
const CATEGORY_LABELS: Record<string, string> = { DeskSetupAndPeripherals: "Desk Setup & Peripherals" };
export const categoryLabel = (c: string) => CATEGORY_LABELS[c] ?? c.replace(/([a-z])([A-Z])/g, "$1 $2");

/** The categories a vendor can pick when creating a product (value = what the API expects). */
export const PRODUCT_CATEGORIES = ["DeskSetupAndPeripherals", "Audio", "Wearables", "Living", "Health"] as const;

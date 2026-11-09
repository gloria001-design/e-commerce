import type { Product } from "@/types/catalog";

const DEFAULT_BACKEND = "https://e-commerce-backend-0l5v.onrender.com";
const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BACKEND).replace(/\/$/, "");
// NEXT_PUBLIC_USE_PROXY=true sends calls to this site's own /api/v1/* (see next.config.ts), which Next
// forwards to the backend. Same-origin means no CORS and first-party cookies. Default is direct.
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === "true";
const API_BASE = USE_PROXY ? "" : BACKEND_ORIGIN;

export type ApiError = Error & { status?: number };
export type ApiProduct = { id: string; productTitle: string; category: string; description: string; quantity: number; colour: string; price: number; productPhoto?: string[]; adminId?: string; createdAt?: string; updatedAt?: string };
export type CartApiItem = { id: string; productId: string; quantity: number; product: ApiProduct };
export type CartResponse = { message: string; items: CartApiItem[]; subtotal: number; itemCount: number };
type Json = Record<string, unknown>;

/** Called on any 401 so the UI can drop a stale (expired-cookie) session. Set by <SessionSync />. */
let unauthorizedHandler: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => { unauthorizedHandler = fn; };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    // credentials: "include" is what lets the browser store and send the login cookie.
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: "include",
      headers: { ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(init.headers ?? {}) },
    });
  } catch {
    throw new Error("Can't reach the server. If it was idle it may be waking up, so wait a few seconds and try again.");
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      const detail = data.message;
      message = Array.isArray(detail) ? detail.join(", ") : data.error ?? detail ?? message;
    } catch {}
    if (response.status === 401) unauthorizedHandler?.();
    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null as T;
  try { return await response.json(); } catch { return null as T; }
}

const post = <T>(path: string, body: Json) => request<T>(path, { method: "POST", body: JSON.stringify(body) });

// ---- auth -------------------------------------------------------------------------------------
export const loginCustomer = (email: string, password: string) => post<unknown>("/api/v1/login", { email, password });
export const loginVendor = (email: string, password: string) => post<unknown>("/api/v1/admin/login", { email, password });
export const createCustomer = (input: { fullName: string; email: string; password: string; phoneNumber: string }) => post("/api/v1/create", input);
export const createVendor = (input: { name: string; storeName: string; phoneNumber: string; email: string; password: string }) => post("/api/v1/admin/create", input);
export const verifyCustomer = (email: string, otp: string) => post("/api/v1/verify", { email, otp });
export const verifyVendor = (email: string, otp: string) => post("/api/v1/admin/verify", { email, otp });
export const resendCustomerOtp = (email: string) => post("/api/v1/resend", { email });
export const resendVendorOtp = (email: string) => post("/api/v1/admin/resend-otp", { email });
export const requestPasswordReset = (email: string, admin = false) => post(admin ? "/api/v1/admin/forgot-password" : "/api/v1/forgot-password", { email });
export const resetPassword = (email: string, password: string, admin = false) => post(admin ? "/api/v1/admin/reset-password" : "/api/v1/reset-password", { email, password });
export const changePassword = (oldPassword: string, newPassword: string, admin = false) => post(admin ? "/api/v1/admin/change-password" : "/api/v1/change-password", { oldPassword, newPassword });

/**
 * The login cookie is (most likely) httpOnly, so only the server can clear it.
 * UNVERIFIED PATHS: these logout URLs are a best guess. Check them against Swagger.
 * A failure is swallowed so the local session is always cleared.
 */
export async function logout(admin = false) {
  const path = admin ? "/api/v1/admin/logout" : "/api/v1/logout";
  for (const method of ["POST", "GET"]) {
    try { await request(path, { method }); return true; } catch (e) {
      const status = (e as ApiError).status;
      if (status !== 404 && status !== 405) return false;
    }
  }
  return false;
}

/** Pulls whatever profile fields the login response happens to include. */
export type Profile = { name?: string; email?: string; phone?: string; storeName?: string };
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
export function readProfile(data: unknown): Profile {
  const root = isObj(data) ? data : {};
  const nested = [root.user, root.admin, root.customer, root.vendor, root.data].find(isObj);
  const src = isObj(nested) ? nested : root;
  return { name: str(src.fullName) ?? str(src.name) ?? str(src.username), email: str(src.email), phone: str(src.phoneNumber), storeName: str(src.storeName) };
}

// ---- products ---------------------------------------------------------------------------------
export const getProducts = (admin = false) =>
  request<{ count: number; products: ApiProduct[] }>(admin ? "/api/v1/product/getAllProductsForAdmin" : "/api/v1/product/getAllProducts", { method: "GET" });

/**
 * Product detail. No single-product endpoint is wired up here, so this reads the product list and
 * picks one out (the same call the shop grid makes). Swap in a GET-by-id call here if Swagger has one;
 * the page only depends on this return shape.
 */
export async function getProductDetail(id: string): Promise<{ product: Product | null; related: Product[] }> {
  const data = await getProducts();
  const all = (data?.products ?? []).map(productToCatalog);
  const product = all.find((p) => p.id === id) ?? null;
  const related = product ? all.filter((p) => p.id !== id && p.category === product.category).slice(0, 4) : [];
  return { product, related };
}

export async function createProduct(input: { productTitle: string; category: string; description: string; quantity: number; colour: string; price: number; productPhoto: File[] }) {
  const body = new FormData();
  body.set("productTitle", input.productTitle);
  body.set("category", input.category);
  body.set("description", input.description);
  body.set("quantity", String(input.quantity));
  body.set("colour", input.colour);
  body.set("price", String(input.price));
  input.productPhoto.forEach((file) => body.append("productPhoto", file));
  return request<ApiProduct>("/api/v1/product/create", { method: "POST", body });
}

// ---- cart -------------------------------------------------------------------------------------
export const getCart = () => request<CartResponse>("/api/v1/cart/get", { method: "GET" });
export const addToCart = (productId: string, quantity = 1) => post(`/api/v1/cart/add/${productId}`, { quantity });
export const updateCartItem = (itemId: string, quantity: number) => request(`/api/v1/cart/update/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) });
export const removeCartItem = (itemId: string) => request(`/api/v1/cart/remove/${itemId}`, { method: "DELETE" });

// ---- mapping ----------------------------------------------------------------------------------
function photoUrl(path?: string) {
  if (!path) return undefined;
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${BACKEND_ORIGIN}/${path.replace(/^\/+/, "")}`;
}

/** Backend prices are cents (the product form sends price * 100), the UI shows major units. */
export function productToCatalog(p: ApiProduct): Product {
  return { id: p.id, name: p.productTitle, category: p.category || "Other", price: p.price / 100, color: p.colour, image: photoUrl(p.productPhoto?.[0]), images: (p.productPhoto ?? []).map(photoUrl).filter((u): u is string => !!u), stock: p.quantity ?? 0, description: p.description };
}

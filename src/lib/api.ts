// Browser calls same-origin "/api/v1/..."; next.config.ts proxies them to the backend, so no CORS.
const API_BASE = "";
export type ApiError = Error & { status?: number };
export type ApiProduct = { id: string; productTitle: string; category: string; description: string; quantity: number; colour: string; price: number; productPhoto?: string[]; adminId?: string; createdAt?: string; updatedAt?: string };
export type CartApiItem = { id: string; productId: string; quantity: number; product: ApiProduct };
export type CartResponse = { message: string; items: CartApiItem[]; subtotal: number; itemCount: number };
type Json = Record<string, unknown>;
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, credentials: "include", headers: { ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(init.headers ?? {}) } });
  if (!response.ok) { let message = `Request failed (${response.status})`; try { const data = await response.json(); const detail = data.message; message = Array.isArray(detail) ? detail.join(", ") : data.error ?? detail ?? message; } catch {} const error = new Error(message) as ApiError; error.status = response.status; throw error; }
  if (response.status === 204) return null as T;
  try { return await response.json(); } catch { return null as T; }
}
const post = <T>(path: string, body: Json) => request<T>(path, { method: "POST", body: JSON.stringify(body) });
export const loginCustomer = (email: string, password: string) => post("/api/v1/login", { email, password });
export const loginVendor = (email: string, password: string) => post("/api/v1/admin/login", { email, password });
export const createCustomer = (input: { fullName: string; email: string; password: string; phoneNumber: string }) => post("/api/v1/create", input);
export const createVendor = (input: { name: string; storeName: string; phoneNumber: string; email: string; password: string }) => post("/api/v1/admin/create", input);
export const verifyCustomer = (email: string, otp: string) => post("/api/v1/verify", { email, otp });
export const verifyVendor = (email: string, otp: string) => post("/api/v1/admin/verify", { email, otp });
export const resendCustomerOtp = (email: string) => post("/api/v1/resend", { email });
export const resendVendorOtp = (email: string) => post("/api/v1/admin/resend-otp", { email });
export const requestPasswordReset = (email: string, admin = false) => post(admin ? "/api/v1/admin/forgot-password" : "/api/v1/forgot-password", { email });
export const resetPassword = (email: string, password: string, admin = false) => post(admin ? "/api/v1/admin/reset-password" : "/api/v1/reset-password", { email, password });
export const changePassword = (oldPassword: string, newPassword: string, admin = false) => post(admin ? "/api/v1/admin/change-password" : "/api/v1/change-password", { oldPassword, newPassword });
export async function getProducts(admin = false) { return request<{ count: number; products: ApiProduct[] }>(admin ? "/api/v1/product/getAllProductsForAdmin" : "/api/v1/product/getAllProducts", { method: "GET" }); }
export async function createProduct(input: { productTitle: string; category: string; description: string; quantity: number; colour: string; price: number; productPhoto: File[] }) { const body = new FormData(); body.set("productTitle", input.productTitle); body.set("category", input.category); body.set("description", input.description); body.set("quantity", String(input.quantity)); body.set("colour", input.colour); body.set("price", String(input.price)); input.productPhoto.forEach((file) => body.append("productPhoto", file)); return request<ApiProduct>("/api/v1/product/create", { method: "POST", body }); }
export const getCart = () => request<CartResponse>("/api/v1/cart/get", { method: "GET" });
export const addToCart = (productId: string, quantity = 1) => post(`/api/v1/cart/add/${productId}`, { quantity });
export const updateCartItem = (itemId: string, quantity: number) => request(`/api/v1/cart/update/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) });
export const removeCartItem = (itemId: string) => request(`/api/v1/cart/remove/${itemId}`, { method: "DELETE" });
export function productToCatalog(product: ApiProduct) { return { id: product.id, name: product.productTitle, category: product.category, price: product.price / 100, rating: 0, reviews: 0, color: product.colour, image: product.productPhoto?.[0] } as import("@/types/catalog").Product; }


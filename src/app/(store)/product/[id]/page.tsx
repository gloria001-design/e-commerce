import { ProductDetail } from "@/components/store/product-detail";

export const metadata = { title: "Product · Aura" };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}

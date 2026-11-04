import { ProductForm } from "@/components/vendor/product-form";
import { VendorGate } from "@/components/vendor/vendor-gate";

export default function VendorNewProductPage() {
  return (
    <VendorGate>
      <ProductForm backHref="/vendor" backLabel="Back to dashboard" />
    </VendorGate>
  );
}

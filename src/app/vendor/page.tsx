import { Dashboard } from "@/components/vendor/dashboard";
import { VendorGate } from "@/components/vendor/vendor-gate";

export default function VendorHome() {
  return (
    <VendorGate>
      <Dashboard />
    </VendorGate>
  );
}

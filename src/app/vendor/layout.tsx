export const metadata = { title: "Aura Vendor" };

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <div className="theme-aura min-h-screen bg-canvas text-ink">{children}</div>;
}

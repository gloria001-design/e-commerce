export const metadata = { title: "Aura Admin" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="theme-aura min-h-screen bg-canvas text-ink">{children}</div>;
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
export const metadata: Metadata = { title: "Aura Market", description: "A unified marketplace for buying, selling, and managing modern essentials." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body className={`${jakarta.variable} antialiased`}>{children}</body></html>; }

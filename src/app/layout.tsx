import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
export const metadata: Metadata = { title: "Aura Market", description: "A unified marketplace for buying, selling, and managing modern essentials." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className={cn("font-sans", geist.variable)}><body className={`${jakarta.variable} antialiased`}>{children}</body></html>; }

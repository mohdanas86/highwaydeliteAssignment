import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Highway Delite - Discover Amazing Experiences",
  description: "Book unique adventures and create unforgettable memories. Curated small-group experiences with certified guides. Safety first.",
  keywords: "travel, experiences, booking, adventures, tours, activities, highway delite",
  authors: [{ name: "Highway Delite" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#FFD11A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}

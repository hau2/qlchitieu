import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BottomNav from "@/app/components/ui/BottomNav";
import Header from "@/app/components/ui/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quản lý chi tiêu cá nhân | Spending Tracker",
  description:
    "Ứng dụng giúp giới trẻ quản lý thu nhập, ngân sách và chi tiêu mỗi ngày.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-512x512.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Header />

        <main className="pb-20">{children}</main>

        <BottomNav />
      </body>
    </html>
  );
}

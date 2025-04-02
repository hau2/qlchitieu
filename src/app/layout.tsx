import ThemeToggle from "@/app/components/ui/ThemeToggle";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BottomNav from "@/app/components/ui/BottomNav";

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
        <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b dark:border-zinc-700 p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Save My Money</h1>
          <ThemeToggle />
        </header>

        <main className="pb-20">{children}</main>

        <BottomNav />
      </body>
    </html>
  );
}

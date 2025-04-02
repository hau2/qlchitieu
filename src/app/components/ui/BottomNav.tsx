"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, PlusCircle, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/transactions", icon: History, label: "Lịch sử" },
  { href: "/record", icon: PlusCircle, label: "Ghi giao dịch", center: true },
  { href: "/budget", icon: Wallet, label: "Ngân sách" },
  { href: "/settings", icon: Settings, label: "Tiện ích" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t dark:border-zinc-700 z-50">
      <div className="relative flex justify-around items-end h-16 text-xs">
        {items.map(({ href, icon: Icon, label, center }, index) => {
          if (center) {
            return (
              <Link
                key={href}
                href={href}
                className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pink-500 text-white w-18 h-18 rounded-full flex flex-col items-center justify-center shadow-lg z-10"
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] mt-0.5">Ghi chép GD</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2",
                pathname === href && "text-pink-500 font-medium"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

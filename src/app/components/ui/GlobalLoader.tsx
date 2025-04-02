"use client"
import { useUserData } from "@/app/components/lib/useUserData";

export default function GlobalLoader() {
    const { loading } = useUserData();
    return loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <div className="text-lg font-medium animate-pulse text-pink-500">
            Đang tải dữ liệu...
          </div>
        </div>
      ) : <></>;
  }
"use client";

import AuthButton from "@/app/components/AuthButton";
import { useUserData } from "@/app/components/lib/useUserData";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from '@/lib/firebase';
import React from "react";

export default function Header() {
  const { user } = useUserData();
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-lg font-semibold">Save My Money</h1>
      <div className="flex flex-row">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm hidden sm:block">
              👋 {user.displayName}
            </span>
            <img
              src={user.photoURL ?? ''}
              alt="Avatar"
              className="w-8 h-8 rounded-full border"
              referrerPolicy="no-referrer"
            />
            <Button variant="outline" size="sm" onClick={() => signOut(auth)}>
              Đăng xuất
            </Button>
          </div>
        ) : (
          <AuthButton />
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

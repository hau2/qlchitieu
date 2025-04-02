/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { auth, provider } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return user ? (
    <div className="flex items-center gap-2">
      <span className="text-sm">👋 {user.displayName}</span>
      <Button size="sm" variant="secondary" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  ) : (
    <Button size="sm" onClick={handleLogin}>
      Đăng nhập với Google
    </Button>
  );
}

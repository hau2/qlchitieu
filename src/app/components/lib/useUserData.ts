/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

interface FinanceData {
  budgets: Record<string, Record<string, { limit: number; icon: string }>>;
  transactions: Record<string, { spending: Transaction[]; income: Transaction[] }>;
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const ref = doc(firestore, 'users', firebaseUser.uid);

        const unsubscribeDoc = onSnapshot(ref, async (docSnap) => {
          if (docSnap.exists()) {
            setFinanceData(docSnap.data() as FinanceData);
            setLoading(false);
          } else {
            const defaultData: FinanceData = {
              budgets: {},
              transactions: {},
            };
            await setDoc(ref, defaultData);
            setFinanceData(defaultData);
            setLoading(false);
          }
        });

        return () => unsubscribeDoc();
      } else {
        setFinanceData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const saveFinanceData = async (newData: any) => {
    if (!user) return;
    const ref = doc(firestore, 'users', user.uid);
    await setDoc(ref, newData);
  };

  return {
    user,
    financeData,
    saveFinanceData,
    loading,
  };
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { firestore } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const updateUserData = async (uid: string, data: any) => {
  const userDoc = doc(firestore, "users", uid);
  await setDoc(userDoc, data, { merge: true });
};

export const getUserData = async (uid: string) => {
  const userDoc = doc(firestore, "users", uid);
  const snapshot = await getDoc(userDoc);
  return snapshot.exists() ? snapshot.data() : null;
};
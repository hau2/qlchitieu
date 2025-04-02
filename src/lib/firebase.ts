// firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config lấy từ Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyA5YlnzTsqWlmtBTD_yTiEd96a9KrV-re8",
    authDomain: "save-my-money-5c42d.firebaseapp.com",
    projectId: "save-my-money-5c42d",
    storageBucket: "save-my-money-5c42d.firebasestorage.app",
    messagingSenderId: "588466251038",
    appId: "1:588466251038:web:e5a33fd6f78ac0d312950f"
};

// Khởi tạo app nếu chưa tồn tại
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
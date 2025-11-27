import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA6r0qEiPS7AP_ndRd93yPUOLy7UbaolDg", // TODO: Replace with your actual API Key
    authDomain: "campushub-75b39.firebaseapp.com", // Assumed from project ID, please verify
    projectId: "campushub-75b39",
    storageBucket: "campushub-75b39.firebasestorage.app",
    messagingSenderId: "7634332378",
    appId: "1:7634332378:web:269777bfdd72aa728f93e3",
    measurementId: "G-EWZW2YM6VR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


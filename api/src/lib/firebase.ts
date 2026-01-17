import admin from 'firebase-admin';

if (!admin.apps.length) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
            console.log("Firebase Admin berhasil connect!");
        } catch (error) {
            console.error("Gagal init Firebase", error);
        }
    } else {
        console.warn("Firebase Admin TIDAK berjalan karena .env belum lengkap. (Mode Testing Only)");
    }
}

export const firebaseAdmin = admin;
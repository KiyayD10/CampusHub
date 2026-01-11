import { NextResponse } from "next/server";
import { verifyFirebaseToken, generateToken } from '@/lib/auth';
import Prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Frontend kirim "token" (firebase id token) & data pelengkap
        const { token, role, npm, phone, name } = body;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token Firebase wajib dikirim" },
                { status: 400 }
            );
        }

        // Verifikasi Token ke Firebase
        const firebaseUser = await verifyFirebaseToken(token);
        if (!firebaseUser || !firebaseUser.email) {
            return NextResponse.json(
                { success: false, message: "Token Firebase tidak valid atau expired" },
                { status: 401 }
            );
        }

        const email = firebaseUser.email;

        // 2. Cek apakah user ini udah ada 
        let user = await Prisma.user.findUnique({
            where: { email },
        });

        // Kalau belum ada, kita BUAT BARU
        if (!user) {
            // Default role student kalau tidak dikirim
            const userRole = role || 'student'; 
            
            user = await Prisma.user.create({
                data: {
                    email: email,
                    name: name || firebaseUser.name || "No Name",
                    password: "FIREBASE_AUTH_USER", 
                    role: userRole,
                    npm: npm || null,
                    phone: phone || null,
                    firebaseUid: firebaseUser.uid,
                }
            });
        }

        // Generate Token JWT Backend (Session sendiri)
        const backendToken = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        });

        return NextResponse.json({
            success: true,
            message: "Login/Register berhasil",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name
                },
                token: backendToken // Token ini yang disimpan frontend
            }
        });

    } catch (error) {
        console.error("Auth Error:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
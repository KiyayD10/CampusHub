import { NextResponse } from "next/server";
import { verifyFirebaseToken, generateToken } from "@/lib/auth";
import Prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token } = body;

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
                { success: false, message: "Token tidak valid atau expired" },
                { status: 401 }
            );
        }

        const email = firebaseUser.email;

        // Cari user di database berdasarkan email dari token
        const user = await Prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                npm: true,
                phone: true,
                avatar: true
            }
        });

        // Jika user tidak ketemu harus (register)
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User belum terdaftar. Silakan registrasi terlebih dahulu." },
                { status: 404 }
            );
        }

        // Kalau user ada Generate Token Session
        const sessionToken = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        });

        // Kembalikan respons sukses
        return NextResponse.json(
            {
                success: true,
                message: "Login berhasil",
                data: {
                    token: sessionToken,
                    user: user
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server saat login" },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import { validateRequiredFields, isValidEmail, verifyPassword } from "@/lib/auth";
import Prisma from "@/lib/prisma";

export async function POST(request: NextResponse) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Cek field wajib (email, password)
        const validationError = validateRequiredFields(body, ['email', 'password']);
        if (validationError) {
            return NextResponse.json(
                { success: false, error: "Validasi Gagal", message: validationError }, 
                { status: 400 }
            )
        }

        // Validasi format email
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { success: false, error: "Email tidak valid", message: "Format email tidak valid" }, 
                { status: 400 }
            )
        }

        // Cari user berdasarkan email
        const user = await Prisma.user.findUnique({ 
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                npm: true,
                phone: true,
                avatar: true
            }
        })

        // User tidak ditemukan
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Kredensial tidak valid", message: "Email atau password salah" },
                { status: 401 }
            )
        }

        // Verifikasi password
        const isPasswordValid = await verifyPassword(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Kredensial tidak valid", message: "Email atau password salah" },
                { status: 401 }
            )
        }
    }
}
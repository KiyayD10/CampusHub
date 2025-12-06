import { NextResponse } from "next/server";
import { validateRequiredFields, isValidEmail, verifyPassword, generateToken } from "@/lib/auth";
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

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        })

        // Siapin data user tanpa password
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            npm: user.npm,
            phone: user.phone,
            avatar: user.avatar
        }

        // Kembalikan respon sukses
        return NextResponse.json(
            { success: true, message: "Login berhasil",
                data: { token, user: userData }
            }, 
            { status: 200 }
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Login error:", error.message)
        } else {
            console.error("Login error:", error)
        }
        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan", message: "Terjadi kesalahan saat login" },
            { status: 500 }
        )
    }
}
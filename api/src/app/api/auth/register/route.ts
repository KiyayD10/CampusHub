import { NextResponse } from "next/server";
import { validateRequiredFields, isValidEmail, validatePassword, hashPassword } from '@/lib/auth'
import Prisma from "@/lib/prisma";

// Buat fungsi utama buat tangani permintaan POST
export async function POST(request: NextResponse) {
    try {
        const body = await request.json();
        const { name, email, password, role, npm, phone } = body;

        // Cek field wajib (name, email, password)
        const validationError = validateRequiredFields(body, ['name', 'email', 'password'])
        if (validationError) {
            return NextResponse.json(
                { success: false, error: "Validasi Gagal", message: validationError }, 
                { status: 400 }
            )
        }

        // Cek format email bener atau enggak
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { success: false, error: "Validasi Gagal", message: "Email tidak valid" }, 
                { status: 400 }
            )
        }

        // Cek format password kuat atau lemah
        const passwordError = validatePassword(password);
        if (passwordError) {
            return NextResponse.json(
                { success: false, error: "Password lemah", message: passwordError }, 
                { status: 400 }
            )
        }

        // Cek role (hanya mahasiswa atau dosen)
        const validRoles = ['student', 'lecturer']
        const userRole = role || 'student'
        if (!validRoles.includes(userRole)) {
            return NextResponse.json(
                { success: false, error: "Validasi Gagal", message: "Role tidak valid harus (Mahasiswa atau Dosen" },
                { status: 400 }
            )
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await Prisma.user.findUnique({ where: { email } 
        })
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "Email sudah ada", message: "Email sudah terdaftar di sistem" },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Buat user baru
        const newUser = await Prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: userRole,
                npm: npm || null,
                phone: phone || null
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                npm: true,
                phone: true
            }
        })

        // Kirim respon sukses
        return NextResponse.json(
            { success: true, message: "Registrasi berhasil", data: newUser }, 
            { status: 201 }
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Registrasi gagal:", error.message);
        } else {
            console.error("Registrasi gagal:", error);
        }
        return NextResponse.json(
            { success: false, error: "Internal Server Error", message: "Terjadi kesalahan saat registrasi" }, 
            { status: 500 }
        )
    } 
}
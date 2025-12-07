import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, UNAUTHORIZED_RESPONSE } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET user berdasarkan id
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Cek auth
        const authUser = getAuthUser(request)
        if (!authUser) {
            return NextResponse.json(
                { success: false, ...UNAUTHORIZED_RESPONSE }, 
                { status: 401 }
            )
        }

        const userId = parseInt(params.id)

        // SECURITY CHECK (PENTING!) kalau bukan admin DAN bukan akun sendiri, tolak aksesnya
        if (authUser.role !== 'admin' && authUser.id !== userId) {
            return NextResponse.json(
                { success: false, error: "Forbidden", message: "Anda tidak memiliki akses untuk melihat profil ini" }, 
                { status: 403 }
            )
        }

        // Ambil data user berdasarkan id
        const user = await prisma.user.findUnique({ 
            where: { id: userId },
            select: {
                id: true, 
                name: true, 
                email: true, 
                role: true, 
                npm: true, 
                phone: true, 
                avatar: true, 
                createdAt: true, 
                updatedAt: true, 
                _count: {
                    select: {
                        tasks: true,
                        attendances: true,
                        products: true
                    }
                }
            }
        })
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Not Found", message: "User tidak ditemukan" }, 
                { status: 404 }
            )
        }
        return NextResponse.json(
            { success: true, data: user },
            { status: 200 }
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Get user error:", error.message)
        } else {
            console.error("Get user error:", error)
        }
        return NextResponse.json({ success: false, error: "Internal Server Error", message: "Terjadi kesalahan saat mengambil data user" }, 
            { status: 500 }
        )
    }
}
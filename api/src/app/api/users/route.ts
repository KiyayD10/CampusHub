import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, UNAUTHORIZED_RESPONSE } from "@/lib/auth";
import { Prisma } from "@/generated/prisma";

export async function GET(request: NextRequest) {
    try {
        // Cek user ter-autentikasi lewat token
        const authUser = getAuthUser(request)
        if (!authUser) {
            return NextResponse.json(
                { success: false, ...UNAUTHORIZED_RESPONSE }, 
                { status: 401 }
            )
        }

        // Ambil parameter role dari URL
        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')

        // Inisialisasi kondisi query
        let where: Prisma.UserWhereInput = {}

        // Batasi akses berdasarkan role
        if (authUser.role !== 'admin') {
            // Kalau bukan admin, kunci ke diri sendiri
            where = { id: authUser.id }
        } else {
            // Kalau admin, baru boleh filter role
            if (role) {
                where.role = role 
            }
        }

        // Ambil data user tanpa password
        const users = await prisma.user.findMany({ 
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                npm: true,
                phone: true,
                avatar: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return NextResponse.json(
            { success: true, data: users }, 
            { status: 200 }
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Get user error:", error.message)
        } else {
            console.error("Get user error:", error)
        }
        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan", message: "Terjadi kesalahan saat mengambil data user" }, 
            { status: 500 }
        )
    }
}
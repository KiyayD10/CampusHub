// import Prisma from "@/lib/prisma";
import { getAuthUser, UNAUTHORIZED_RESPONSE } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma";

export async function GET(request: NextResponse) {
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
        const roleQuery = searchParams.get('role')

        // Inisialisasi kondisi query
        let where : Prisma.UserWhereInput = {}

        // Batasi akses data berdasarkan role 
        if (getAuthUser.role === 'admin') {
            where = { 
                id: authUser.id
            }
        } else {
            if (roleQuery) {
                where.role = roleQuery
            }
        }

        // Ambil data user tanpa password
        const users = await Prisma.user.findMany({ 
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
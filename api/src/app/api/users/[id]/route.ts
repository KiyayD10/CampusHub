import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, UNAUTHORIZED_RESPONSE } from '@/lib/auth'
import { error } from "console";

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

    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, 
            { status: 500 }
        )
    }
}
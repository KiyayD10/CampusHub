import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, UNAUTHORIZED_RESPONSE } from '@/lib/auth'

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
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, 
            { status: 500 }
        )
    }
}
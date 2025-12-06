import { getAuthUser, UNAUTHORIZED_RESPONSE } from "@/lib/auth";
import { NextResponse } from "next/server";

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
    }
}
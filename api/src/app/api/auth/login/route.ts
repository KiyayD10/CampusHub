import { NextResponse } from "next/server";
import { validateRequiredFields } from "@/lib/auth";

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
    }
}
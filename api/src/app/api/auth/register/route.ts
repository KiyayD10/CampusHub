import { NextResponse } from "next/server";
import { validateRequiredFields, isValidEmail, validatePassword } from '@/lib/auth'

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

        // Cek format password bener atau enggak
        const passwordError = validatePassword(password);
        if (passwordError) {
            return NextResponse.json(
                { success: false, error: "Validasi Gagal", message: passwordError }, 
                { status: 400 }
            )
        }
    }
}
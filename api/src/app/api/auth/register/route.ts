import { NextResponse } from "next/server";

// Buat fungsi utama buat tangani permintaan POST
export async function POST(request: NextResponse) {
    try {
        const body = await request.json();
        const { name, email, password, role, npm, phone } = body;
    }
}
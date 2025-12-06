import { NextResponse } from "next/server";
import { validateRequiredFields } from "@/lib/auth";

export async function POST(request: NextResponse) {
    try {
        const body = await request.json();
        const { email, password } = body;
    }
}
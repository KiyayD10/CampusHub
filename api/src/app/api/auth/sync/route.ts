import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { uid, email, name, avatar, npm } = body;

        // Validasi Input
        if (!uid || !email) {
            return NextResponse.json(
                { error: "Wajib kirim UID & Email!" }, 
                { status: 400 }
            );
        }

        // Cek User di Database
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { firebaseUid: uid }
                ]
            }
        });

        // Handle User Lama
        if (existingUser) {
            if (!existingUser.firebaseUid) {
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { firebaseUid: uid }
                });
            }
            return NextResponse.json({ 
                message: "Sync Berhasil (User Lama)", 
                user: existingUser 
            });
        }

        // Handle User Baru
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name || 'Mahasiswa Baru',
                firebaseUid: uid,
                role: 'student',
                password: null,
                avatar: avatar || null,
                npm: npm || null
            }
        });
        return NextResponse.json({ 
            message: "Sync Berhasil (User Baru Dibuat)", 
            user: newUser 
        }, { status: 201 });

    } catch (error) {
        console.error('Sync Error:', error);
        return NextResponse.json(
            { error: 'Gagal koneksi ke Database' }, 
            { status: 500 }
        );
    }
}
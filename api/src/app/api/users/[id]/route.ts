import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, hashPassword, UNAUTHORIZED_RESPONSE } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from "@/generated/prisma";

// Definisi Tipe untuk Context Params
interface RouteParams {
    params: {
        id: string;
    };
}

// GET user berdasarkan id
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json(UNAUTHORIZED_RESPONSE, { status: 401 });
        }

        const targetUserId = parseInt(params.id);
        const currentUserId = Number(authUser.id);

        // Security Check: Hanya Admin atau Pemilik Akun yang boleh lihat
        if (authUser.role !== 'admin' && currentUserId !== targetUserId) {
            return NextResponse.json(
                { success: false, error: "Forbidden", message: "Anda tidak memiliki akses untuk melihat profil ini" }, 
                { status: 403 }
            );
        }

        const user = await prisma.user.findUnique({ 
            where: { id: targetUserId },
            select: {
                id: true, 
                name: true, 
                email: true, 
                role: true, 
                npm: true, 
                phone: true, 
                avatar: true, 
                createdAt: true, 
                updatedAt: true, 
                _count: {
                    select: {
                        tasks: true,
                        attendances: true,
                        products: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Not Found", message: "User tidak ditemukan" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: user },
            { status: 200 }
        );

    } catch (error: unknown) {
        // Penanganan Error Strict Type (Tanpa any)
        if (error instanceof Error) {
            console.error("Get user error:", error.message);
        } else {
            console.error("Get user unknown error:", error);
        }
        
        return NextResponse.json(
            { success: false, error: "Internal Server Error", message: "Terjadi kesalahan saat mengambil data user" }, 
            { status: 500 }
        );
    }
}

// UPDATE user profile
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const authUser = getAuthUser(request);
        if (!authUser) {
            return NextResponse.json(UNAUTHORIZED_RESPONSE, { status: 401 });
        }

        const targetUserId = parseInt(params.id);
        const currentUserId = Number(authUser.id);

        // Security Check
        if (authUser.role !== 'admin' && currentUserId !== targetUserId) {
            return NextResponse.json(
                { success: false, error: "Forbidden", message: "Anda tidak bisa mengubah profile user lain" }, 
                { status: 403 }
            );
        }

        // Parsing body
        const body = await request.json();
        const { name, phone, avatar, password } = body;

        // Menggunakan tipe Prisma untuk updateData agar type-safe
        const updateData: Prisma.UserUpdateInput = {};

        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (password) {
            updateData.password = await hashPassword(password);
        }

        const updatedUser = await prisma.user.update({ 
            where: { id: targetUserId },
            data: updateData,
            select: {
                id: true, 
                name: true, 
                email: true, 
                role: true, 
                npm: true, 
                phone: true, 
                avatar: true, 
                createdAt: true, 
                updatedAt: true
            }
        });

        return NextResponse.json(
            { success: true, message: "Profile berhasil diupdate", data: updatedUser },
            { status: 200 }
        );

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Update user error:', error.message);
        } else {
            console.error('Update user unknown error:', error);
        }

        return NextResponse.json(
            { success: false, error: "Internal Error", message: "Terjadi kesalahan saat update profile" },
            { status: 500 }
        );
    }
}
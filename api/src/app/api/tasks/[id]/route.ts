import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, UNAUTHORIZED_RESPONSE } from "@/lib/auth";

// Helper type untuk parameter ID
interface Params {
    params: { id: string }
}

// Ambil detail satu tugas
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const user = getAuthUser(request); 
        if (!user) return NextResponse.json(UNAUTHORIZED_RESPONSE, { status: 401 });

        const taskId = parseInt(params.id);

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });

        if (!task || task.userId !== user.id) {
            return NextResponse.json({ success: false, message: "Tugas tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: task });
    } catch (error) {
        console.error("GET Tasks Error:", error); 
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// Update tugas
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const user = getAuthUser(request);
        if (!user) return NextResponse.json(UNAUTHORIZED_RESPONSE, { status: 401 });

        const taskId = parseInt(params.id);
        const body = await request.json();

        const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

        if (!existingTask || existingTask.userId !== user.id) {
            return NextResponse.json({ success: false, message: "Tugas tidak ditemukan atau akses ditolak" }, { status: 404 });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title: body.title,
                description: body.description,
                status: body.status,
                priority: body.priority,
                dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
                course: body.course,
                reminder: body.reminder ? new Date(body.reminder) : null
            }
        });

        return NextResponse.json({ success: true, message: "Tugas berhasil diupdate", data: updatedTask });
    } catch (error) {
        console.error("PATCH Task Error:", error);
        return NextResponse.json({ success: false, message: "Gagal update tugas" }, { status: 500 });
    }
}

// Hapus tugas
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const user = getAuthUser(request);
        if (!user) return NextResponse.json(UNAUTHORIZED_RESPONSE, { status: 401 });

        const taskId = parseInt(params.id);

        const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

        if (!existingTask || existingTask.userId !== user.id) {
            return NextResponse.json({ success: false, message: "Tugas tidak ditemukan" }, { status: 404 });
        }

        await prisma.task.delete({ where: { id: taskId } });

        return NextResponse.json({ success: true, message: "Tugas berhasil dihapus" });
    } catch (error) {
        console.error("DELETE Task Error:", error);
        return NextResponse.json({ success: false, message: "Gagal menghapus tugas" }, { status: 500 });
    }
}
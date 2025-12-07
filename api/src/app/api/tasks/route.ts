import { Prisma } from "@/generated/prisma";
import prisma from '@/lib/prisma'
import { getAuthUser, UNAUTHORIZED_RESPONSE } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Ambil semua tugas
export async function GET(request: NextRequest) {
    try {
        const authUser = getAuthUser(request)
        if (!authUser) {
            return NextResponse.json(
                { success: false, ...UNAUTHORIZED_RESPONSE }, 
                { status: 401 }
            )
        }

        // Ambil parameter query
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const priority = searchParams.get('priority')
        const course = searchParams.get('course')

        const where : Prisma.TaskWhereInput = {
            userId: authUser.id
        }
        if (status) where.status = status
        if (priority) where.priority = priority
        if (course) where.course = course

        // Ambil tasks
        const tasks = await prisma.task.findMany({ 
            where,
            orderBy: [
                { status: 'asc' }, 
                { dueDate: 'asc' }, 
                { createdAt: 'desc' }
            ],
            include: { 
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        // Hitung statistik
        const stats = {
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            done: tasks.filter(t => t.status === 'done').length
        }
        return NextResponse.json(
            { success: true, data: tasks, stats },
            { status: 200 }
        )
    } catch (error) {
        console.error("Get tasks error:", error)
        if (error instanceof Error) {
            console.error("Error message:", error.message)
        }
        return NextResponse.json(
            { success: false, error: "Internal Server Error", message: "Terjadi kesalahan saat mengambil data tasks" },
            { status: 500 }
        )
    }
}
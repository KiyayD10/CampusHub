import { PrismaClient, Prisma } from "@/generated/prisma";

// Buat "slot" global buat nyimpen koneksi Prisma
declare global {
    var prisma: PrismaClient | undefined;
}

// Buat koneksi Prisma
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
};

// Cek udah ada koneksi di global?
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

// Fungsi bantuan buat putusin koneksi (saat testing)
export async function disconnectPrisma() {
    await prisma.$disconnect();
}

// Helper function untuk handle database errors
export function handlePrismaError(error: unknown) {
    // Kita cek apakah error berasal dari Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            const field = (error.meta?.target as string[])?.[0] || 'field';
            return {
                status: 400,
                message: `${field} sudah terdaftar di sistem`,
            };
        }
        if (error.code === 'P2025') {
            return {
                status: 404,
                message: 'Data tidak ditemukan'
            }
        }
        if (error.code === 'P2003') {
            return {
                status: 400,
                message: 'Data referensi tidak valid atau sudah terhapus'
            }
        }
    }
    
    console.error("Database Error:", error); // Log error 
    return {
        status: 500,
        message: 'Terjadi kesalahan pada server database',
    };
}
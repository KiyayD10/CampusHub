import { PrismaClient } from "@/generated/prisma";

// Bikin "slot" global buat nyimpen koneksi Prisma
declare global {
    var prisma: PrismaClient | undefined;
}

// buat koneksi Prisma
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: 
        process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
};

// Cek udah ada koneksi di global?
const prisma = globalThis.prisma ?? prismaClientSingleton();

// Kirim satu koneksi ini buat dipake di seluruh aplikasi
export default prisma;

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

// Fungsi bantuan buat mutusin koneksi (saat testing)
export async function disconnectPrisma() {
    await prisma.$disconnect();
}

// Helper function untuk handle database errors
export function handlePrismaError(error: unknown) {
    if (error instanceof Error && 'code' in error) {
        const prismaError = error as { code?: string; meta?: { target?: string[] } };
        if (prismaError.code === 'P2002') {
            const field = prismaError.meta?.target?.[0] || 'field';
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
                message: 'Data tidak valid atau sudah terhapus'
            }
        }
    }
    return {
        status: 500,
        message: 'Terjadi kesalahan pada database',
    };
}
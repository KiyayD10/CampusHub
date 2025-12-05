import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { NextRequest } from "next/server";

// Hash password dengan bcrypt
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Verifikasi password dengan hash
export async function verifyPassword(
    password : string, 
    hashedPassword : string
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

// Tipe data untuk isi toke JWT
export interface JWTPayload {
    id: number;
    email: string;
    role: string;
    name: string;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET tidak ada di file .env");
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    return jwt.sign(payload, secret, {
        expiresIn: expiresIn as SignOptions['expiresIn'], 
        issuer: "campushub-api",
    });
}

// Verifikasi JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET tidak ada di file .env");
        }
        const decode = jwt.verify(token, secret) as JWTPayload  ;
        return decode;
    } catch (error) {
        console.error("Gagal memverifikasi token:", error);
        return null;
    }
}

// Ekstrak token dari Authorizaton header
export function extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return null;

    // Format: Bearer <token>
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];  
}

// Dapatkan data user yang  terautentikasi dari request
export function getAuthUser(request: NextRequest): JWTPayload | null {
    const token = extractToken(request);
    if (!token) return null;
    return verifyToken(token);
}

// Cek apakah user memiliki role tertentu 
export function hashRole(user: JWTPayload, allowedRoles: string[]): boolean {
    return allowedRoles.includes(user.role);
}
export const UNAUTHORIZED_RESPONSE = {
    error: 'Unauthorized',
    message: 'Token tidak valid atau sudah expired',
};
export const FORBIDDEN_RESPONSE = {
    error: 'Forbidden',
    message: 'Anda tidak memiliki akses ke halaman ini',
};

// Validasi field yang wajib diisi dari request body
export function validasiRequiredFields(
    body: Record<string, unknown>,
    requiredFields: string[]
): string | null {
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
        return `Field ini wajib diisi: ${missingFields.join(', ')}`;
    }
    return null;
}

// Validasi format email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validasi format password
export function validatePassword(password: string): string | null {
    if (password.length < 6) {
        return 'Password minimal 6 karakter';
    }
    return null;
}
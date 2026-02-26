import { NextResponse } from "next/server";
import crypto from "crypto";

// Simple password hashing (for demo purposes - use bcrypt in production)
export function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}

// Simple JWT-like token (for demo purposes)
export function createToken(payload: Record<string, unknown>): string {
    const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
    return Buffer.from(data).toString("base64");
}

export function verifyToken(token: string): Record<string, unknown> | null {
    try {
        const data = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
        if (data.exp < Date.now()) return null;
        return data;
    } catch {
        return null;
    }
}

export function errorResponse(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
}

export function successResponse(data: unknown, status: number = 200) {
    return NextResponse.json(data, { status });
}

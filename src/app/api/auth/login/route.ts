import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createToken, successResponse, errorResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return errorResponse("Email and password are required");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return errorResponse("Invalid credentials", 401);
        }

        const passwordMatch = hashPassword(password) === user.password;
        if (!passwordMatch) {
            return errorResponse("Invalid credentials", 401);
        }

        const token = createToken({ id: user.id, email: user.email, role: user.role });

        return successResponse({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return errorResponse("Internal server error", 500);
    }
}

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createToken, successResponse, errorResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, role, phone, bloodType, hospitalName } = body;

        if (!name || !email || !password) {
            return errorResponse("Name, email, and password are required");
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return errorResponse("Email already registered");
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword(password),
                role: role || "DONOR",
                phone,
            },
        });

        // Create profile based on role
        if (role === "HOSPITAL") {
            await prisma.hospitalProfile.create({
                data: {
                    userId: user.id,
                    hospitalName: hospitalName || name,
                },
            });
        } else {
            await prisma.donorProfile.create({
                data: {
                    userId: user.id,
                    bloodType: bloodType || "O+",
                },
            });
        }

        const token = createToken({ id: user.id, email: user.email, role: user.role });

        return successResponse({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token,
        }, 201);
    } catch (error) {
        console.error("Registration error:", error);
        return errorResponse("Internal server error", 500);
    }
}

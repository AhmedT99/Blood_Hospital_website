import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return errorResponse("Unauthorized", 401);

        const payload = verifyToken(token);
        if (!payload) return errorResponse("Invalid token", 401);

        const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
            include: {
                donorProfile: true,
                hospitalProfile: true,
                appointments: { take: 5, orderBy: { date: "desc" } },
                bloodRequests: { take: 5, orderBy: { createdAt: "desc" } },
            },
        });

        if (!user) return errorResponse("User not found", 404);

        const { password: _, ...userWithoutPassword } = user;
        return successResponse(userWithoutPassword);
    } catch (error) {
        console.error("Get user error:", error);
        return errorResponse("Internal server error", 500);
    }
}

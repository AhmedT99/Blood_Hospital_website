import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return errorResponse("Unauthorized", 401);

        const payload = verifyToken(token);
        if (!payload) return errorResponse("Invalid token", 401);

        const requests = await prisma.bloodRequest.findMany({
            where: { userId: payload.id as string },
            orderBy: { createdAt: "desc" },
        });

        return successResponse(requests);
    } catch (error) {
        console.error("Get requests error:", error);
        return errorResponse("Internal server error", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return errorResponse("Unauthorized", 401);

        const payload = verifyToken(token);
        if (!payload) return errorResponse("Invalid token", 401);

        const body = await request.json();
        const { bloodType, units, urgency, reason } = body;

        if (!bloodType || !units) {
            return errorResponse("Blood type and units are required");
        }

        const bloodRequest = await prisma.bloodRequest.create({
            data: {
                userId: payload.id as string,
                bloodType,
                units,
                urgency: urgency || "NORMAL",
                reason,
            },
        });

        return successResponse(bloodRequest, 201);
    } catch (error) {
        console.error("Create request error:", error);
        return errorResponse("Internal server error", 500);
    }
}

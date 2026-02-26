import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return errorResponse("Unauthorized", 401);

        const payload = verifyToken(token);
        if (!payload) return errorResponse("Invalid token", 401);

        const appointments = await prisma.appointment.findMany({
            where: { userId: payload.id as string },
            orderBy: { date: "desc" },
        });

        return successResponse(appointments);
    } catch (error) {
        console.error("Get appointments error:", error);
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
        const { date, time, location, notes, bloodType } = body;

        if (!date || !time || !location) {
            return errorResponse("Date, time, and location are required");
        }

        const appointment = await prisma.appointment.create({
            data: {
                userId: payload.id as string,
                date: new Date(date),
                time,
                location,
                notes,
                bloodType,
            },
        });

        return successResponse(appointment, 201);
    } catch (error) {
        console.error("Create appointment error:", error);
        return errorResponse("Internal server error", 500);
    }
}

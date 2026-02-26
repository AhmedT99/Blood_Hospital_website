import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, successResponse, errorResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return errorResponse("Unauthorized", 401);

        const payload = verifyToken(token);
        if (!payload) return errorResponse("Invalid token", 401);

        const hospital = await prisma.hospitalProfile.findFirst({
            where: { userId: payload.id as string },
        });

        if (!hospital) return errorResponse("Hospital profile not found", 404);

        const inventory = await prisma.bloodInventory.findMany({
            where: { hospitalId: hospital.id },
            orderBy: { bloodType: "asc" },
        });

        return successResponse(inventory);
    } catch (error) {
        console.error("Get inventory error:", error);
        return errorResponse("Internal server error", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return errorResponse("Unauthorized", 401);

        const payload = verifyToken(token);
        if (!payload) return errorResponse("Invalid token", 401);

        const hospital = await prisma.hospitalProfile.findFirst({
            where: { userId: payload.id as string },
        });

        if (!hospital) return errorResponse("Hospital profile not found", 404);

        const body = await request.json();
        const { bloodType, units } = body;

        if (!bloodType || units === undefined) {
            return errorResponse("Blood type and units are required");
        }

        // Check if inventory for this blood type already exists
        const existing = await prisma.bloodInventory.findFirst({
            where: { hospitalId: hospital.id, bloodType },
        });

        let inventory;
        if (existing) {
            inventory = await prisma.bloodInventory.update({
                where: { id: existing.id },
                data: {
                    units,
                    status: units <= 0 ? "CRITICAL" : units <= 5 ? "LOW" : "AVAILABLE",
                },
            });
        } else {
            inventory = await prisma.bloodInventory.create({
                data: {
                    hospitalId: hospital.id,
                    bloodType,
                    units,
                    status: units <= 0 ? "CRITICAL" : units <= 5 ? "LOW" : "AVAILABLE",
                },
            });
        }

        return successResponse(inventory, existing ? 200 : 201);
    } catch (error) {
        console.error("Update inventory error:", error);
        return errorResponse("Internal server error", 500);
    }
}

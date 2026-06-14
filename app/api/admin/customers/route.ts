import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminCustomers } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customers = await getAdminCustomers();
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers", details: error.message },
      { status: 500 }
    );
  }
}


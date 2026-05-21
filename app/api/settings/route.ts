import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbSettings = await prisma.setting.findMany();
    
    // We only expose a subset of public settings
    const publicSettings = {
      storeName: "Lumen Furniture",
      supportEmail: "support@lumen.com",
      currency: "USD",
      emiRate: 0,
    };

    dbSettings.forEach((s) => {
      if (s.key === "storeName") publicSettings.storeName = s.value;
      if (s.key === "supportEmail") publicSettings.supportEmail = s.value;
      if (s.key === "currency") publicSettings.currency = s.value;
      if (s.key === "emiRate") publicSettings.emiRate = parseFloat(s.value) || 0;
    });

    return NextResponse.json(publicSettings);
  } catch (error: any) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

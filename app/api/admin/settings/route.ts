import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS: Record<string, string> = {
  storeName: "Lumen Furniture",
  supportEmail: "support@lumen.com",
  currency: "USD",
  emiRate: "0",
  notifyOrderConfirmations: "true",
  notifyEmiReminders: "true",
  notifyLowStockAlerts: "true",
};

export async function GET() {
  try {
    const dbSettings = await prisma.setting.findMany();
    
    // Create settings object mapping keys to values
    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    dbSettings.forEach((s) => {
      settings[s.key] = s.value;
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error retrieving admin settings:", error);
    return NextResponse.json(
      { error: "Failed to retrieve settings", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Upsert each key-value pair in a transaction
    const upserts = Object.entries(body).map(([key, value]) => {
      const stringValue = typeof value === "boolean" ? String(value) : String(value);
      return prisma.setting.upsert({
        where: { key },
        update: { value: stringValue },
        create: { key, value: stringValue },
      });
    });

    await prisma.$transaction(upserts);

    // If currency is updated, sync it with a cookie for layout-level render
    if (body.currency) {
      const cookieStore = await cookies();
      cookieStore.set("store_currency", body.currency, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error: any) {
    console.error("Error updating admin settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings", details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });
    return NextResponse.json(addresses);
  } catch (e) {
    console.error("GET /api/account/addresses error:", e);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, street, city, state, zipCode, country, isDefault } = await req.json();
    if (!userId || !street || !city || !state || !zipCode || !country) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // If new address is default, clear others
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: { userId, street, city, state, zipCode, country, isDefault: !!isDefault },
    });
    return NextResponse.json(address, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add address." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, userId } = await req.json();
    if (!id || !userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    const updated = await prisma.address.update({ where: { id }, data: { isDefault: true } });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

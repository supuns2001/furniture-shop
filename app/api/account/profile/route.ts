import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const { userId, name } = await req.json();
    if (!userId || !name) return NextResponse.json({ error: "userId and name required" }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, currentPassword, newPassword } = await req.json();
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const hashedCurrent = hashPassword(currentPassword);
    if (hashedCurrent !== user.password) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashPassword(newPassword) },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to change password." }, { status: 500 });
  }
}

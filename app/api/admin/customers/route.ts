import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            paymentMethod: true,
          },
        },
        addresses: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const customers = users.map((user) => {
      const successfulOrders = user.orders.filter(o => o.status !== "CANCELLED");
      const totalSpent = successfulOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const ordersCount = user.orders.length;
      
      // Calculate last order date
      let lastOrderDateStr = "No orders yet";
      if (user.orders.length > 0) {
        const sortedOrders = [...user.orders].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        lastOrderDateStr = sortedOrders[0].createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      // Dynamic customer status calculations
      let status = "Active";
      const now = new Date();
      const createdDiffDays = (now.getTime() - user.createdAt.getTime()) / (1000 * 3600 * 24);
      
      if (totalSpent > 150000) {
        status = "VIP";
      } else if (createdDiffDays <= 14 && ordersCount <= 1) {
        status = "New";
      } else if (ordersCount === 0 && createdDiffDays > 30) {
        status = "Inactive";
      } else if (user.orders.length > 0) {
        const sortedOrders = [...user.orders].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        const lastOrderDiffDays = (now.getTime() - sortedOrders[0].createdAt.getTime()) / (1000 * 3600 * 24);
        if (lastOrderDiffDays > 180) {
          status = "Inactive";
        }
      }

      return {
        id: user.id,
        name: user.name || "Unnamed Customer",
        email: user.email,
        orders: ordersCount,
        spent: totalSpent,
        lastOrder: lastOrderDateStr,
        status: status,
        createdAt: user.createdAt.toISOString(),
        addresses: user.addresses,
        ordersList: user.orders.map(o => ({
          id: o.id,
          totalAmount: o.totalAmount,
          status: o.status,
          createdAt: o.createdAt.toISOString(),
          paymentMethod: o.paymentMethod,
        })),
      };
    });

    return NextResponse.json(customers);
  } catch (error: any) {
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers", details: error.message },
      { status: 500 }
    );
  }
}

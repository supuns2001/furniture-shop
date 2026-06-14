import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminInstalments, isDemoMode } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plans = await getAdminInstalments();
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error("GET /api/admin/instalments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch instalment plans", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json(
      { error: "Demo Mode: Write operations are disabled. Connect a real database to enable this feature." },
      { status: 403 }
    );
  }
  try {
    const body = await req.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "paymentId and status are required." },
        { status: 400 }
      );
    }

    const validStatuses = ["PAID", "PENDING", "OVERDUE"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Find the payment and its parent instalment
    const existingPayment = await prisma.instalmentPayment.findUnique({
      where: { id: paymentId },
      include: { instalment: true },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Instalment payment record not found." },
        { status: 404 }
      );
    }

    const instalmentId = existingPayment.instalmentId;
    const paidDate = status === "PAID" ? new Date() : null;

    // Run in transaction to maintain strict integrity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the target instalment payment
      await tx.instalmentPayment.update({
        where: { id: paymentId },
        data: {
          status,
          paidDate,
        },
      });

      // 2. Fetch all payments for this instalment to compute total paid
      const allPayments = await tx.instalmentPayment.findMany({
        where: { instalmentId },
      });

      const totalPaid = allPayments.reduce(
        (sum, pay) => sum + (pay.status === "PAID" ? pay.amount : 0),
        0
      );

      const totalAmount = existingPayment.instalment.totalAmount;
      // Precision margin buffer for floating point comparison
      const isCompleted = totalPaid >= (totalAmount - 0.05);
      const newStatus = isCompleted ? "COMPLETED" : "ACTIVE";

      // 3. Update the parent instalment plan
      const updatedInstalment = await tx.instalment.update({
        where: { id: instalmentId },
        data: {
          paidAmount: totalPaid,
          status: newStatus,
        },
        include: {
          order: {
            select: {
              id: true,
              createdAt: true,
              totalAmount: true,
              paymentMethod: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              orderItems: {
                include: {
                  product: {
                    select: {
                      name: true,
                      images: {
                        take: 1,
                        select: { url: true },
                      },
                    },
                  },
                },
              },
            },
          },
          payments: {
            orderBy: { dueDate: "asc" },
          },
        },
      });

      return updatedInstalment;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PATCH /api/admin/instalments error:", error);
    return NextResponse.json(
      { error: "Failed to update instalment payment status.", details: error.message },
      { status: 500 }
    );
  }
}

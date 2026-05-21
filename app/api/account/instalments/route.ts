import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  try {
    const instalments = await prisma.instalment.findMany({
      where: { order: { userId } },
      include: {
        order: {
          include: { orderItems: { include: { product: { select: { name: true } } } } },
        },
        payments: { orderBy: { dueDate: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(instalments);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId is required." }, { status: 400 });
    }

    // Retrieve the payment record with parent instalment details
    const payment = await prisma.instalmentPayment.findUnique({
      where: { id: paymentId },
      include: { instalment: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
    }

    if (payment.status === "PAID") {
      return NextResponse.json({ error: "This payment has already been made." }, { status: 400 });
    }

    // Update payment status and cumulative instalment plan paidAmount
    const updatedPayment = await prisma.$transaction(async (tx) => {
      // 1. Mark this specific instalment payment as PAID
      const pay = await tx.instalmentPayment.update({
        where: { id: paymentId },
        data: {
          status: "PAID",
          paidDate: new Date(),
        },
      });

      // 2. Increment paidAmount on parent Instalment plan
      const nextPaidAmount = parseFloat((payment.instalment.paidAmount + payment.amount).toFixed(2));
      
      // Compare paidAmount against totalAmount (allowing for small float differences)
      const allCompleted = nextPaidAmount >= parseFloat(payment.instalment.totalAmount.toFixed(2)) - 0.05;

      await tx.instalment.update({
        where: { id: payment.instalmentId },
        data: {
          paidAmount: nextPaidAmount,
          status: allCompleted ? "COMPLETED" : payment.instalment.status,
        },
      });

      return pay;
    });

    return NextResponse.json(updatedPayment);
  } catch (error: any) {
    console.error("POST /api/account/instalments error:", error);
    return NextResponse.json({ error: "Failed to process payment." }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMonths, startOfDay } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      guestEmail,
      cartItems,          // [{ productId, name, price, quantity }]
      paymentMethod,      // "FULL_PAYMENT" | "INSTALMENT"
      emiMonths,          // 3 | 6 | 12  (only for INSTALMENT)
      shippingAddress,    // { street, city, state, zipCode, country }
      saveAddress,        // boolean — save address to profile
    } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!paymentMethod) {
      return NextResponse.json({ error: "Payment method is required." }, { status: 400 });
    }
    if (!shippingAddress?.street) {
      return NextResponse.json({ error: "Shipping address is required." }, { status: 400 });
    }

    const totalAmount = cartItems.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    // ── Upsert shipping address ──────────────────────────────────────────
    let addressId: string | undefined;
    if (userId) {
      // Check if user already has this exact address
      const existing = await prisma.address.findFirst({
        where: {
          userId,
          street:  shippingAddress.street,
          city:    shippingAddress.city,
          zipCode: shippingAddress.zipCode,
        },
      });

      if (existing) {
        addressId = existing.id;
      } else if (saveAddress) {
        const hasDefault = await prisma.address.findFirst({ where: { userId, isDefault: true } });
        const newAddr = await prisma.address.create({
          data: {
            userId,
            street:    shippingAddress.street,
            city:      shippingAddress.city,
            state:     shippingAddress.state || "",
            zipCode:   shippingAddress.zipCode,
            country:   shippingAddress.country || "Sri Lanka",
            isDefault: !hasDefault,
          },
        });
        addressId = newAddr.id;
      }
    }

    // ── Create order ─────────────────────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        userId:            userId || null,
        guestEmail:        guestEmail || null,
        totalAmount,
        status:            "PENDING",
        paymentMethod,
        shippingAddressId: addressId || null,
        orderItems: {
          create: cartItems.map((item: { productId: string; price: number; quantity: number }) => ({
            productId: item.productId,
            price:     item.price,
            quantity:  item.quantity,
          })),
        },
      },
    });

    // ── Create instalment plan + payment schedule ─────────────────────────
    if (paymentMethod === "INSTALMENT" && emiMonths) {
      const monthlyAmount = parseFloat((totalAmount / emiMonths).toFixed(2));
      const today = startOfDay(new Date());

      const instalment = await prisma.instalment.create({
        data: {
          orderId:      order.id,
          totalAmount,
          paidAmount:   0,
          tenureMonths: emiMonths,
          interestRate: 0,
          status:       "ACTIVE",
        },
      });

      // Generate payment schedule
      const payments = Array.from({ length: emiMonths }, (_, i) => ({
        instalmentId: instalment.id,
        amount:       i === emiMonths - 1
          ? parseFloat((totalAmount - monthlyAmount * (emiMonths - 1)).toFixed(2)) // last payment handles rounding
          : monthlyAmount,
        dueDate:  addMonths(today, i + 1),
        status:   "PENDING" as const,
      }));

      await prisma.instalmentPayment.createMany({ data: payments });
    }

    // ── Clear DB cart for logged-in users ─────────────────────────────────
    if (userId) {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    return NextResponse.json({ orderId: order.id, totalAmount }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to place order." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: { select: { name: true } } } },
        shippingAddress: true,
        instalmentPlan:  { include: { payments: { orderBy: { dueDate: "asc" }, take: 1 } } },
      },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

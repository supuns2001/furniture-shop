import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/cart?userId=xxx  — fetch cart for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, variants: true },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST /api/cart — add item to cart
// Body: { userId, productId, quantity }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, productId, quantity = 1 } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "userId and productId are required" },
        { status: 400 }
      );
    }

    // Upsert cart for user
    let cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    let cartItem;
    if (existingItem) {
      // Increment quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// PATCH /api/cart — update item quantity
// Body: { cartItemId, quantity }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity == null) {
      return NextResponse.json(
        { error: "cartItemId and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      // Remove item if qty < 1
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      return NextResponse.json({ deleted: true });
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/cart error:", error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

// DELETE /api/cart — remove item or clear entire cart
// Body: { cartItemId } OR { userId, clearAll: true }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItemId, userId, clearAll } = body;

    if (clearAll && userId) {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
      return NextResponse.json({ cleared: true });
    }

    if (cartItemId) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      return NextResponse.json({ deleted: true });
    }

    return NextResponse.json({ error: "cartItemId or clearAll+userId required" }, { status: 400 });
  } catch (error: any) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
  }
}

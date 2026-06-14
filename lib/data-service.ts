/**
 * data-service.ts
 * ---------------
 * Unified data access layer.
 *  - When DEMO_MODE=true  → returns static in-memory mock data (no DB needed)
 *  - When DEMO_MODE=false → executes real Prisma queries against the database
 */

import {
  demoBrands,
  demoCategories,
  demoCustomers,
  demoDashboard,
  demoInstalments,
  demoOrders,
  demoProducts,
} from "./demo-data";
import { prisma } from "./prisma";

/** Returns true when DEMO_MODE env variable is set to "true" */
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────

/** Admin product list (with stock / status summary) */
export async function getAdminProducts() {
  if (isDemoMode()) {
    return demoProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      price: p.basePrice,
      stock: p.stock,
      status: p.status,
      image: p.image,
    }));
  }

  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      images: { select: { url: true } },
      variants: { select: { stock: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => {
    const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
    let status = "Active";
    if (totalStock === 0) status = "Out of Stock";
    else if (totalStock < 10) status = "Low Stock";
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      price: p.basePrice,
      stock: totalStock,
      status,
      image: p.images[0]?.url || "",
    };
  });
}

/** Store-facing product list (full detail with images & variants) */
export async function getStoreProducts() {
  if (isDemoMode()) {
    return demoProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      basePrice: p.basePrice,
      isEmiEligible: p.isEmiEligible,
      category: p.category,
      images: p.images,
      variants: p.variants,
      createdAt: p.createdAt,
    }));
  }

  return prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      images: { select: { url: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Latest N products for homepage New Arrivals */
export async function getLatestProducts(take = 4) {
  if (isDemoMode()) {
    return [...demoProducts]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, take)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice,
        images: p.images,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        description: p.description,
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId,
        brandId: p.brandId,
        isEmiEligible: p.isEmiEligible,
      }));
  }

  return prisma.product.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: {
      images: { select: { url: true } },
    },
  });
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────

export async function getAdminCategories() {
  if (isDemoMode()) {
    return demoCategories;
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    productCount: cat._count.products,
    status: "Active",
  }));
}

// ─── BRANDS ───────────────────────────────────────────────────────────────

export async function getAdminBrands() {
  if (isDemoMode()) {
    return demoBrands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      productCount: b.productCount,
      status: "Active",
    }));
  }

  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    productCount: b._count.products,
    status: "Active",
  }));
}

// ─── ORDERS ───────────────────────────────────────────────────────────────

export async function getAdminOrders() {
  if (isDemoMode()) {
    return demoOrders;
  }

  return prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      shippingAddress: true,
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              images: { take: 1, select: { url: true } },
            },
          },
        },
      },
      instalmentPlan: {
        select: { id: true, status: true, paidAmount: true, totalAmount: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── CUSTOMERS ────────────────────────────────────────────────────────────

export async function getAdminCustomers() {
  if (isDemoMode()) {
    return demoCustomers;
  }

  const users = await prisma.user.findMany({
    where: { role: "USER" },
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

  const now = new Date();
  return users.map((user) => {
    const successfulOrders = user.orders.filter((o) => o.status !== "CANCELLED");
    const totalSpent = successfulOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const ordersCount = user.orders.length;

    let lastOrderDateStr = "No orders yet";
    if (user.orders.length > 0) {
      const sorted = [...user.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      lastOrderDateStr = sorted[0].createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }

    let status = "Active";
    const createdDiffDays = (now.getTime() - user.createdAt.getTime()) / (1000 * 3600 * 24);
    if (totalSpent > 150000) status = "VIP";
    else if (createdDiffDays <= 14 && ordersCount <= 1) status = "New";
    else if (ordersCount === 0 && createdDiffDays > 30) status = "Inactive";
    else if (user.orders.length > 0) {
      const sorted = [...user.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const lastDiff = (now.getTime() - sorted[0].createdAt.getTime()) / (1000 * 3600 * 24);
      if (lastDiff > 180) status = "Inactive";
    }

    return {
      id: user.id,
      name: user.name || "Unnamed Customer",
      email: user.email,
      orders: ordersCount,
      spent: totalSpent,
      lastOrder: lastOrderDateStr,
      status,
      createdAt: user.createdAt.toISOString(),
      addresses: user.addresses,
      ordersList: user.orders.map((o) => ({
        id: o.id,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        paymentMethod: o.paymentMethod,
      })),
    };
  });
}

// ─── INSTALMENTS ──────────────────────────────────────────────────────────

export async function getAdminInstalments() {
  if (isDemoMode()) {
    return demoInstalments;
  }

  return prisma.instalment.findMany({
    include: {
      order: {
        select: {
          id: true, createdAt: true, totalAmount: true, paymentMethod: true,
          user: { select: { id: true, name: true, email: true } },
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  images: { take: 1, select: { url: true } },
                },
              },
            },
          },
        },
      },
      payments: { orderBy: { dueDate: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────

export async function getDashboardData() {
  if (isDemoMode()) {
    return demoDashboard;
  }
  // Real dashboard logic remains in its own route handler
  return null;
}

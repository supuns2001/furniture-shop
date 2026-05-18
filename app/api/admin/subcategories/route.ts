import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: {
          select: { name: true },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formatted = subCategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      parentCategory: sub.category.name,
      categoryId: sub.categoryId,
      productCount: sub._count.products,
      status: "Active",
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryId, slug: customSlug, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Sub-category name is required" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Parent category ID is required" }, { status: 400 });
    }

    const slug =
      customSlug ||
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const subCategory = await prisma.subCategory.create({
      data: {
        name,
        slug,
        categoryId,
        description: description || null,
      },
    });

    return NextResponse.json(subCategory);
  } catch (error: any) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to create subcategory", details: error.message },
      { status: 500 }
    );
  }
}

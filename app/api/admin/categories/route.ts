import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminCategories, isDemoMode } from "@/lib/data-service";

export async function GET() {
  try {
    const formatted = await getAdminCategories();
    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (isDemoMode()) {
    return NextResponse.json(
      { error: "Demo Mode: Write operations are disabled. Connect a real database to enable this feature." },
      { status: 403 }
    );
  }
  try {
    const body = await request.json();
    const { name, slug: customSlug, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug =
      customSlug ||
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    );
  }
}

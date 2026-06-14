import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminProducts, isDemoMode } from "@/lib/data-service";

export async function GET() {
  try {
    const formatted = await getAdminProducts();
    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
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
    const {
      name,
      description,
      basePrice,
      categoryId,
      subCategoryId,
      brandId,
      isEmiEligible,
      images, // array of image URL strings (either local upload or url fallback)
      variants, // array of { color, material, stock, priceOffset }
    } = body;

    if (!name) return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    if (!description) return NextResponse.json({ error: "Product description is required" }, { status: 400 });
    if (!basePrice) return NextResponse.json({ error: "Base price is required" }, { status: 400 });
    if (!categoryId) return NextResponse.json({ error: "Category is required" }, { status: 400 });

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    let uniqueSlug = baseSlug;
    const exists = await prisma.product.findUnique({ where: { slug: uniqueSlug } });
    if (exists) {
      uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.$transaction(async (tx) => {
      // 1. Create the Product record
      const p = await tx.product.create({
        data: {
          name,
          slug: uniqueSlug,
          description,
          basePrice: parseFloat(basePrice),
          categoryId,
          subCategoryId: subCategoryId || null,
          brandId: brandId || null,
          isEmiEligible: isEmiEligible ?? true,
        },
      });

      // 2. Create the images (enforce maximum 3)
      if (images && images.length > 0) {
        // Enforce max 3 images in the db
        const slicedImages = images.slice(0, 3);
        await tx.productImage.createMany({
          data: slicedImages.map((url: string) => ({
            url,
            productId: p.id,
          })),
        });
      }

      // 3. Create variants
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: p.id,
            color: v.color || null,
            material: v.material || null,
            stock: parseInt(v.stock, 10) || 0,
            priceOffset: parseFloat(v.priceOffset) || 0,
          })),
        });
      }

      return p;
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (isDemoMode()) {
    return NextResponse.json(
      { error: "Demo Mode: Write operations are disabled. Connect a real database to enable this feature." },
      { status: 403 }
    );
  }
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (isDemoMode()) {
    return NextResponse.json(
      { error: "Demo Mode: Write operations are disabled. Connect a real database to enable this feature." },
      { status: 403 }
    );
  }
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      basePrice,
      categoryId,
      subCategoryId,
      brandId,
      isEmiEligible,
      images, // array of image URL strings (up to 3)
      variants, // array of { color, material, stock, priceOffset }
    } = body;

    if (!id) return NextResponse.json({ error: "Product ID is required for updating" }, { status: 400 });
    if (!name) return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    if (!description) return NextResponse.json({ error: "Product description is required" }, { status: 400 });
    if (!basePrice) return NextResponse.json({ error: "Base price is required" }, { status: 400 });
    if (!categoryId) return NextResponse.json({ error: "Category is required" }, { status: 400 });

    // Generate unique slug if name changed and conflicts with another product
    const baseSlug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    let uniqueSlug = baseSlug;
    const exists = await prisma.product.findFirst({
      where: {
        slug: uniqueSlug,
        NOT: { id: id },
      },
    });
    if (exists) {
      uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.$transaction(async (tx) => {
      // 1. Update general Product details
      const p = await tx.product.update({
        where: { id },
        data: {
          name,
          slug: uniqueSlug,
          description,
          basePrice: parseFloat(basePrice),
          categoryId,
          subCategoryId: subCategoryId || null,
          brandId: brandId || null,
          isEmiEligible: isEmiEligible ?? true,
        },
      });

      // 2. Refresh images (Delete old & Re-insert up to 3)
      await tx.productImage.deleteMany({
        where: { productId: id },
      });
      if (images && images.length > 0) {
        const slicedImages = images.slice(0, 3);
        await tx.productImage.createMany({
          data: slicedImages.map((url: string) => ({
            url,
            productId: id,
          })),
        });
      }

      // 3. Refresh variants (Delete old & Re-insert)
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: id,
            color: v.color || null,
            material: v.material || null,
            stock: parseInt(v.stock, 10) || 0,
            priceOffset: parseFloat(v.priceOffset) || 0,
          })),
        });
      }

      return p;
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

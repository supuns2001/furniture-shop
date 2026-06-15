import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditProductForm } from "@/components/admin/edit-product-form";
import { isDemoMode } from "@/lib/data-service";
import { demoBrands, demoCategories, demoProducts, demoSubcategories } from "@/lib/demo-data";

export const metadata = {
  title: "Edit Product | Admin | Lumen",
};

type Params = Promise<{ id: string }>;

interface EditProductPageProps {
  params: Params;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  let product;
  let categories;
  let subCategories;
  let brands;

  if (isDemoMode()) {
    product = demoProducts.find((p) => p.id === id);
    categories = demoCategories;
    subCategories = demoSubcategories;
    brands = demoBrands;
  } else {
    // Retrieve product from database along with relations
    product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
      },
    });

    // Retrieve all taxonomy lists
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    subCategories = await prisma.subCategory.findMany({
      orderBy: { name: "asc" },
    });

    brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
  }

  if (!product) {
    notFound();
  }

  // Map to simple JSON serializable props for the client component
  const formattedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId || "",
    brandId: product.brandId || "",
    isEmiEligible: product.isEmiEligible,
    images: product.images.map((img: { url: string }) => img.url),
    variants: product.variants.map((v: { color: string | null; material: string | null; stock: number; priceOffset: number }) => ({
      color: v.color || "",
      material: v.material || "",
      stock: v.stock,
      priceOffset: v.priceOffset,
    })),
  };

  return (
    <EditProductForm
      product={formattedProduct}
      initialCategories={categories.map((c) => ({ id: c.id, name: c.name }))}
      initialSubCategories={subCategories.map((s) => ({
        id: s.id,
        name: s.name,
        categoryId: s.categoryId,
      }))}
      initialBrands={brands.map((b) => ({ id: b.id, name: b.name }))}
    />
  );
}

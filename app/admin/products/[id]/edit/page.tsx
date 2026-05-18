import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditProductForm } from "@/components/admin/edit-product-form";

export const metadata = {
  title: "Edit Product | Admin | Lumen",
};

type Params = Promise<{ id: string }>;

interface EditProductPageProps {
  params: Params;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // Retrieve product from database along with relations
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Retrieve all taxonomy lists
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const subCategories = await prisma.subCategory.findMany({
    orderBy: { name: "asc" },
  });

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

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
    images: product.images.map((img) => img.url),
    variants: product.variants.map((v) => ({
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

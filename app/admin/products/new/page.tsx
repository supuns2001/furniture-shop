import { prisma } from "@/lib/prisma";
import { NewProductForm } from "@/components/admin/new-product-form";

export const metadata = {
  title: "Add Product | Admin | Lumen",
};

export default async function AddProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const subCategories = await prisma.subCategory.findMany({
    orderBy: { name: "asc" },
  });

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <NewProductForm
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

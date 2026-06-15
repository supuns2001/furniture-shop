import { prisma } from "@/lib/prisma";
import { NewProductForm } from "@/components/admin/new-product-form";
import { isDemoMode } from "@/lib/data-service";
import { demoBrands, demoCategories, demoSubcategories } from "@/lib/demo-data";

export const metadata = {
  title: "Add Product | Admin | Lumen",
};

export default async function AddProductPage() {
  let categories;
  let subCategories;
  let brands;

  if (isDemoMode()) {
    categories = demoCategories;
    subCategories = demoSubcategories;
    brands = demoBrands;
  } else {
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

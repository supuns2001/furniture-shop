import { ProductListing } from "@/components/store/product-listing";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "All Products | Lumen Furniture",
  description: "Browse our curated collection of luxury furniture and home decor.",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
      images: {
        select: {
          url: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-background min-h-screen">
      <ProductListing initialProducts={products} />
    </div>
  );
}

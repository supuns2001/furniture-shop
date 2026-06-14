import { ProductListing } from "@/components/store/product-listing";
import { getStoreProducts } from "@/lib/data-service";

export const metadata = {
  title: "All Products | Lumen Furniture",
  description: "Browse our curated collection of luxury furniture and home decor.",
};

export default async function ProductsPage() {
  const products = await getStoreProducts();

  return (
    <div className="bg-background min-h-screen">
      <ProductListing initialProducts={products as any} />
    </div>
  );
}


import { ProductDetail } from "@/components/store/product-detail";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  return {
    title: product ? `${product.name} | Lumen Furniture` : "Product Not Found | Lumen Furniture",
    description: product ? product.description.substring(0, 160) : "Luxury furniture details.",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
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
      variants: {
        select: {
          id: true,
          color: true,
          material: true,
          stock: true,
          priceOffset: true,
        },
      },
    },
  });

  if (!product) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center py-24">
          <h1 className="text-2xl font-heading mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The requested product could not be located in our catalog.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <ProductDetail product={product} />
    </div>
  );
}

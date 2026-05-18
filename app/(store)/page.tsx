import { Hero } from "@/components/store/hero";
import { FeaturedCollections } from "@/components/store/featured-collections";
import { NewArrivals } from "@/components/store/new-arrivals";
import { BrandStory } from "@/components/store/brand-story";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const latestProducts = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        select: {
          url: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedCollections />
      <NewArrivals products={latestProducts} />
      <BrandStory />
    </div>
  );
}

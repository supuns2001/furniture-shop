import { Hero } from "@/components/store/hero";
import { FeaturedCollections } from "@/components/store/featured-collections";
import { NewArrivals } from "@/components/store/new-arrivals";
import { BrandStory } from "@/components/store/brand-story";
import { getLatestProducts } from "@/lib/data-service";

export default async function Home() {
  const latestProducts = await getLatestProducts(4);

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedCollections />
      <NewArrivals products={latestProducts} />
      <BrandStory />
    </div>
  );
}

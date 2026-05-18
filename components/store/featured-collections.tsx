"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: 1,
    title: "The Lounge Edit",
    subtitle: "Modern Living",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop",
    link: "/products?category=living",
  },
  {
    id: 2,
    title: "Artisan Dining",
    subtitle: "Gather Around",
    image: "https://images.unsplash.com/photo-1617806118233-18e1c0945594?q=80&w=1200&auto=format&fit=crop",
    link: "/products?category=dining",
  },
  {
    id: 3,
    title: "Serene Slumber",
    subtitle: "Bedroom Essentials",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=1200&auto=format&fit=crop",
    link: "/products?category=bedroom",
  }
];

export function FeaturedCollections() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading mb-4 text-foreground">Curated Collections</h2>
            <p className="text-muted-foreground max-w-lg">Discover pieces thoughtfully designed to harmonize with your lifestyle and elevate your everyday spaces.</p>
          </div>
          <Link href="/products" className="hidden md:flex items-center text-sm font-medium tracking-wider uppercase hover:text-primary transition-colors group">
            View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              className="group relative h-[500px] overflow-hidden"
            >
              <Link href={item.link}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute bottom-8 left-8 z-20">
                  <span className="block text-white/80 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                    {item.subtitle}
                  </span>
                  <h3 className="text-white text-2xl font-heading tracking-wide">
                    {item.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 md:hidden">
          <Link href="/products" className="flex justify-center items-center text-sm font-medium tracking-wider uppercase border border-border py-4 hover:border-primary transition-colors">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}

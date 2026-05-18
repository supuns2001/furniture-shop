"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

export type NewArrivalProduct = {
  id: string;
  name: string;
  basePrice: number;
  slug: string;
  images: { url: string }[];
};

export function NewArrivals({ products: propProducts }: { products?: NewArrivalProduct[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const activeProducts = propProducts && propProducts.length > 0
    ? propProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: `$${p.basePrice.toLocaleString()}`,
        image: p.images[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
        slug: p.slug
      }))
    : [
        {
          id: "1",
          name: "Aria Lounge Chair",
          price: "$1,250",
          image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop",
          slug: "aria-lounge-chair",
        },
        {
          id: "2",
          name: "Nordic Minimalist Sofa",
          price: "$3,400",
          image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop",
          slug: "nordic-minimalist-sofa",
        },
        {
          id: "3",
          name: "Walnut Dining Table",
          price: "$2,800",
          image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=800&auto=format&fit=crop",
          slug: "walnut-dining-table",
        },
        {
          id: "4",
          name: "Ceramic Table Lamp",
          price: "$450",
          image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
          slug: "ceramic-table-lamp",
        },
      ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  return (
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading mb-4 text-foreground">New Arrivals</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Explore our latest additions, featuring contemporary silhouettes and unparalleled craftsmanship.</p>
        </div>

        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
        >
          {activeProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="group cursor-pointer">
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-background mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Quick Add Button overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <button className="w-full bg-white/90 backdrop-blur text-foreground py-3 text-sm font-medium tracking-wide uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 text-primary">{product.price}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

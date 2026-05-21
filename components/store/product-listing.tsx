"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCurrency } from "@/components/store/currency-context";

export type Product = {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  category: { name: string };
  images: { url: string }[];
  isEmiEligible: boolean;
};

export function ProductListing({ initialProducts }: { initialProducts: Product[] }) {
  const { formatPrice } = useCurrency();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");

  // Get categories dynamically from the actual loaded products
  const categories = ["All", ...Array.from(new Set(initialProducts.map(p => p.category?.name).filter(Boolean)))];

  const priceRanges = [
    { label: "All Prices", value: "All" },
    { label: `Under ${formatPrice(500)}`, value: "under-500" },
    { label: `${formatPrice(500)} - ${formatPrice(1000)}`, value: "500-1000" },
    { label: `${formatPrice(1000)} - ${formatPrice(2000)}`, value: "1000-2000" },
    { label: `Over ${formatPrice(2000)}`, value: "over-2000" }
  ];

  // Filtering
  const filteredProducts = initialProducts.filter((product) => {
    const categoryMatch = selectedCategory === "All" || product.category?.name === selectedCategory;
    
    let priceMatch = true;
    if (selectedPriceRange === "under-500") {
      priceMatch = product.basePrice < 500;
    } else if (selectedPriceRange === "500-1000") {
      priceMatch = product.basePrice >= 500 && product.basePrice <= 1000;
    } else if (selectedPriceRange === "1000-2000") {
      priceMatch = product.basePrice >= 1000 && product.basePrice <= 2000;
    } else if (selectedPriceRange === "over-2000") {
      priceMatch = product.basePrice > 2000;
    }
    
    return categoryMatch && priceMatch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.basePrice - b.basePrice;
    }
    if (sortBy === "price-high") {
      return b.basePrice - a.basePrice;
    }
    if (sortBy === "newest") {
      return b.id.localeCompare(a.id);
    }
    // "featured" default sorting (default database return order)
    return 0;
  });

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-border gap-6">
        <div>
          <h1 className="text-3xl font-heading text-foreground mb-2">All Products</h1>
          <p className="text-sm text-muted-foreground">{sortedProducts.length} items found</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger className="md:hidden flex items-center gap-2 border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your view of our luxury collection.</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-8">
                <div>
                  <h3 className="font-medium tracking-wide uppercase text-sm mb-4">Categories</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {categories.map((cat) => (
                      <li 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`hover:text-primary cursor-pointer transition-colors ${selectedCategory === cat ? "text-foreground font-semibold" : ""}`}
                      >
                        {cat === "All" ? "All Products" : cat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium tracking-wide uppercase text-sm mb-4">Price Range</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {priceRanges.map((range) => (
                      <li 
                        key={range.value}
                        onClick={() => setSelectedPriceRange(range.value)}
                        className={`hover:text-primary cursor-pointer transition-colors ${selectedPriceRange === range.value ? "text-foreground font-semibold" : ""}`}
                      >
                        {range.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <span className="text-sm text-muted-foreground hidden md:inline">Sort by:</span>
            <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
              <SelectTrigger className="w-[160px] border-none shadow-none bg-transparent focus:ring-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="hidden md:flex items-center border border-border">
            <button 
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="space-y-8 sticky top-32">
            <div>
              <h3 className="font-medium tracking-wide uppercase text-sm mb-4">Categories</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {categories.map((cat) => (
                  <li 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`hover:text-primary cursor-pointer transition-colors py-1 ${selectedCategory === cat ? "text-foreground font-semibold border-l-2 border-foreground pl-2" : "hover:pl-1"}`}
                  >
                    {cat === "All" ? "All Products" : cat}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium tracking-wide uppercase text-sm mb-4">Price Range</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {priceRanges.map((range) => (
                  <li 
                    key={range.value}
                    onClick={() => setSelectedPriceRange(range.value)}
                    className={`hover:text-primary cursor-pointer transition-colors py-1 ${selectedPriceRange === range.value ? "text-foreground font-semibold border-l-2 border-foreground pl-2" : "hover:pl-1"}`}
                  >
                    {range.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid/List */}
        <div className="flex-1">
          <motion.div 
            layout
            className={
              view === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
                : "flex flex-col gap-8"
            }
          >
            <AnimatePresence mode="popLayout">
              {sortedProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={product.id}
                  className={`group cursor-pointer ${view === "list" ? "flex gap-8 items-center border-b border-border pb-8" : ""}`}
                >
                  <Link href={`/products/${product.slug}`} className={view === "list" ? "w-1/3 shrink-0 block" : "block w-full"}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-background mb-4">
                      <Image
                        src={product.images[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className={view === "list" ? "flex-1" : ""}>
                    <span className="text-xs text-muted-foreground tracking-widest uppercase mb-1 block">
                      {product.category?.name || "Furniture"}
                    </span>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className={`text-foreground font-medium transition-colors hover:text-primary ${view === "list" ? "text-2xl mb-2" : "text-base"}`}>
                        {product.name}
                      </h3>
                    </Link>
                    <p className={`text-primary ${view === "list" ? "text-lg mb-4" : "text-sm mt-1"}`}>
                      {formatPrice(product.basePrice)}
                    </p>
                    {view === "list" && (
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                        Designed with uncompromising attention to detail, this piece offers the perfect balance of form and function. Crafted from premium materials to ensure lasting beauty in your home.
                      </p>
                    )}
                    {product.isEmiEligible && (
                      <div className="inline-flex items-center px-2 py-1 bg-muted text-xs text-muted-foreground mt-2">
                        EMI Available
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              No products match your selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

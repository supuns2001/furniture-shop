"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Info, ChevronRight, ChevronLeft, Minus, Plus } from "lucide-react";
import { EMICalculator } from "./emi-calculator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { Product } from "./product-listing";
import { useCurrency } from "@/components/store/currency-context";
import { useCart } from "@/components/store/cart-context";
import { toast } from "sonner";

type ProductVariant = {
  id: string;
  color: string | null;
  material: string | null;
  stock: number;
  priceOffset: number;
};

// Extended product type for details
type DetailedProduct = Product & {
  description: string;
  variants: ProductVariant[];
};

export function ProductDetail({ product }: { product: DetailedProduct }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product.variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentPrice = product.basePrice + (selectedVariant?.priceOffset || 0);
  const isInStock = (selectedVariant?.stock || 0) > 0;

  const handleAddToCart = () => {
    if (!isInStock) return;
    const variantLabel = [selectedVariant?.color, selectedVariant?.material]
      .filter(Boolean)
      .map(s => s!.charAt(0).toUpperCase() + s!.slice(1))
      .join(", ") || "Default";

    addToCart({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity: quantity,
      image: product.images[0]?.url || "",
      variant: variantLabel,
    });

    toast.success(`${quantity} x ${product.name} (${variantLabel}) added to cart!`);
  };


  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs text-muted-foreground tracking-widest uppercase mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <Link href={`/products?category=${product.category?.name.toLowerCase()}`} className="hover:text-primary transition-colors">
          {product.category?.name}
        </Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 mb-24">
        {/* Gallery */}
        <div className="w-full lg:w-3/5 flex flex-col md:flex-row-reverse gap-4">
          <div className="flex-1 relative aspect-square bg-muted group overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 cursor-zoom-in"
              >
                <Image
                  src={product.images[activeImageIndex]?.url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Gallery Controls */}
            {product.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-foreground hover:bg-white">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-foreground hover:bg-white">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0 hide-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square w-20 md:w-full shrink-0 border-2 transition-colors ${
                  idx === activeImageIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-2/5">
          <div className="mb-8 border-b border-border pb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-heading text-foreground leading-tight">{product.name}</h1>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-3xl text-primary font-medium mb-4">
              {formatPrice(currentPrice)}
            </p>
            
            {product.isEmiEligible && <EMICalculator price={currentPrice} />}
          </div>

          <div className="space-y-8 mb-10">
            {/* Color Variants */}
            {product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium tracking-widest uppercase mb-4 flex justify-between">
                  <span>Color: <span className="text-muted-foreground capitalize">{selectedVariant?.color}</span></span>
                </h3>
                <div className="flex gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedVariant?.id === variant.id ? "border-primary p-1" : "border-transparent"
                      }`}
                    >
                      <span 
                        className="block w-full h-full rounded-full border border-black/10" 
                        style={{ backgroundColor: variant.color ? variant.color.toLowerCase() : "transparent" }} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium tracking-widest uppercase mb-4">Quantity</h3>
              <div className="flex items-center border border-border w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col gap-4">
            <button 
              disabled={!isInStock}
              onClick={handleAddToCart}
              className={`w-full py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                isInStock 
                  ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:-translate-y-1" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
              <Info className="w-4 h-4" />
              <span>Free shipping on orders over {formatPrice(1000)}.</span>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <Tabs defaultValue="details">
              <TabsList className="w-full bg-transparent border-b border-border rounded-none h-auto p-0 flex justify-start space-x-8">
                <TabsTrigger value="details" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none px-0 py-3 text-sm tracking-wide uppercase font-medium">Details</TabsTrigger>
                <TabsTrigger value="dimensions" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none px-0 py-3 text-sm tracking-wide uppercase font-medium">Dimensions</TabsTrigger>
                <TabsTrigger value="care" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none px-0 py-3 text-sm tracking-wide uppercase font-medium">Care</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-6 text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </TabsContent>
              <TabsContent value="dimensions" className="pt-6 text-sm text-muted-foreground leading-relaxed">
                <ul className="space-y-2">
                  <li><strong className="text-foreground font-medium">Width:</strong> 85&quot; (216 cm)</li>
                  <li><strong className="text-foreground font-medium">Depth:</strong> 38&quot; (96.5 cm)</li>
                  <li><strong className="text-foreground font-medium">Height:</strong> 32&quot; (81 cm)</li>
                  <li><strong className="text-foreground font-medium">Seat Height:</strong> 18&quot; (45.7 cm)</li>
                </ul>
              </TabsContent>
              <TabsContent value="care" className="pt-6 text-sm text-muted-foreground leading-relaxed">
                Vacuum regularly to remove dust. Blot spills immediately with a clean, dry cloth. Avoid direct sunlight to prevent fading. Professional cleaning recommended annually.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

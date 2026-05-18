"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={ref}
      className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-muted -mt-24"
    >
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, opacity }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618220179428-22790b46a011?q=80&w=2560&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-heading font-normal text-white mb-6 leading-tight"
        >
          Elevate Your Living Space
        </motion.h1>
        
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/90 mb-10 font-light max-w-2xl mx-auto tracking-wide"
        >
          Discover our curated collection of luxury furniture, designed to transform your home into a masterpiece of comfort and style.
        </motion.p>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <Link 
            href="/products"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function BrandStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 relative h-[600px]">
            <motion.div 
              style={{ y: y1 }}
              className="absolute top-0 left-0 w-3/4 h-4/5 z-10"
            >
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop"
                alt="Craftsmanship"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div 
              style={{ y: y2 }}
              className="absolute bottom-0 right-0 w-2/3 h-2/3 z-20 shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1000&auto=format&fit=crop"
                alt="Details"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl font-heading mb-8 text-foreground leading-tight">
                Crafted for those who appreciate the <i className="font-serif italic text-primary">finer details</i>.
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg font-light leading-relaxed">
                <p>
                  At Lumen, we believe that furniture is more than just functional pieces occupying space. It is an expression of your aesthetic, a testament to your taste, and the silent backdrop to your life's most meaningful moments.
                </p>
                <p>
                  Since our inception, we have partnered with master artisans globally to bring you collections that blend timeless elegance with contemporary innovation. Every joint, stitch, and finish is executed with an uncompromising commitment to quality.
                </p>
              </div>
              <button className="mt-10 border-b border-foreground pb-1 text-foreground font-medium uppercase tracking-wider hover:text-primary hover:border-primary transition-colors">
                Discover Our Story
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

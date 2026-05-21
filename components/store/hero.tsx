"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDE_DURATION = 6000; // 6 seconds per slide

const slides = [
  {
    id: 1,
    title: "The Aether Lounge",
    subtitle: "COLLECTION 2026",
    description: "Discover our premium Italian bouclé seating, sculpted solid oak profiles, and sophisticated gold accents designed for refined architectural lounging.",
    image: "/images/luxury_living_room_hero.png",
    ctaText: "Explore Living",
    ctaLink: "/products"
  },
  {
    id: 2,
    title: "Nocturne Master Suite",
    subtitle: "THE ART OF SLUMBER",
    description: "Retreat into absolute luxury with dark ebony frames, brushed gold elements, charcoal linen drapery, and architectural moody lighting.",
    image: "/images/luxury_bedroom_hero.png",
    ctaText: "Explore Bedroom",
    ctaLink: "/products"
  },
  {
    id: 3,
    title: "Lumen Marble Pavilion",
    subtitle: "MINIMALIST HERITAGE",
    description: "Elevate your dining space with pristine Calacatta marble tables, sleek structural curves, and sculptural modern gold chandeliers.",
    image: "/images/luxury_dining_room_hero.png",
    ctaText: "Explore Dining",
    ctaLink: "/products"
  }
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const [timelineProgress, setTimelineProgress] = useState(0);

  // Setup auto-rotating slideshow timer
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    resetTimer();
    
    // Animation frame to update progress bars in sync with auto-slide
    let animFrame: number;
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setTimelineProgress(progress);
      animFrame = requestAnimationFrame(updateProgress);
    };
    
    animFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cancelAnimationFrame(animFrame);
    };
  }, [index]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSelect = (idx: number) => {
    if (idx === index) return;
    setDirection(idx > index ? 1 : -1);
    setIndex(idx);
  };

  // Slider transition definitions
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      scale: 1.05,
      opacity: 0
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 120, damping: 20 },
        opacity: { duration: 0.8 },
        scale: { duration: 6, ease: "easeOut" as const } // Slow zoom while active
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        x: { duration: 0.6, ease: "easeInOut" as const },
        opacity: { duration: 0.4 }
      }
    })
  };

  const currentSlide = slides[index];

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black -mt-24">
      {/* Slider Background with scale animation */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.image})` }}
            />
            {/* Ambient vignette and overlay to maximize readability and premium contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/85 md:from-black/75 md:via-black/30 md:to-black/75" />
            <div className="absolute inset-0 bg-radial-vignette" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6 pt-24 md:pt-16">
          {/* Subtitle tag reveal */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="text-xs sm:text-sm font-medium tracking-[0.3em] text-primary uppercase"
              >
                {currentSlide.subtitle}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Mask-reveal Title */}
          <div className="overflow-hidden py-1">
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 1.0, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-heading font-normal text-white leading-[1.1] tracking-wide"
              >
                {currentSlide.title}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Description reveal */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 0.85 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 1.0, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
                className="text-sm sm:text-base md:text-lg text-white/90 font-light leading-relaxed max-w-2xl tracking-wide"
              >
                {currentSlide.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Staggered CTA trigger */}
          <div className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <Link
                  href={currentSlide.ctaLink}
                  className="inline-flex items-center gap-2 bg-white text-black hover:bg-primary hover:text-white px-8 sm:px-10 py-4 text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-white hover:border-primary rounded-none group cursor-pointer"
                >
                  {currentSlide.ctaText}
                  <motion.span 
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Side Arrow Navigation Buttons with Rotating Rings */}
      <div className="absolute right-8 sm:right-16 bottom-24 z-20 flex gap-4">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="relative w-12 h-12 flex items-center justify-center text-white hover:text-primary rounded-full group cursor-pointer overflow-hidden border border-white/20 transition-colors duration-300"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300 z-10" />
          <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="relative w-12 h-12 flex items-center justify-center text-white hover:text-primary rounded-full group cursor-pointer overflow-hidden border border-white/20 transition-colors duration-300"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300 z-10" />
          <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Bottom Luxury Horizontal Indicators with Progress bars */}
      <div className="absolute left-6 sm:left-12 right-6 sm:right-auto bottom-8 z-20 flex gap-4 md:gap-6 max-w-sm sm:w-[380px]">
        {slides.map((slide, idx) => {
          const isActive = idx === index;
          return (
            <button
              key={slide.id}
              onClick={() => handleSelect(idx)}
              className="flex-1 text-left space-y-2 group cursor-pointer outline-none"
            >
              {/* Progress Line container */}
              <div className="h-[2px] w-full bg-white/20 relative rounded-full overflow-hidden">
                {isActive && (
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-primary"
                    style={{ width: `${timelineProgress}%` }}
                  />
                )}
                {!isActive && (
                  <div className="absolute top-0 left-0 h-full w-0 bg-primary group-hover:w-full transition-all duration-300" />
                )}
              </div>
              
              {/* Little label description */}
              <div className="hidden sm:block">
                <span className={`text-[10px] tracking-widest font-semibold block transition-colors duration-300
                  ${isActive ? "text-primary" : "text-white/40 group-hover:text-white/70"}
                `}>
                  0{idx + 1}
                </span>
                <span className={`text-[10px] tracking-wide font-normal block truncate transition-colors duration-300
                  ${isActive ? "text-white" : "text-white/30 group-hover:text-white/65"}
                `}>
                  {slide.title.split(" ")[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Center Animated Scroll Needle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50 z-20">
        <span className="text-[9px] text-white tracking-[0.25em] uppercase font-light">Scroll</span>
        <div className="w-[1px] h-10 bg-white/30 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-4 bg-primary"
            animate={{
              y: [0, 40, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 2.0,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </section>
  );
}

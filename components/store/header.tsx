"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ShoppingBag, Search, Menu, User } from "lucide-react";
import { CartDrawer } from "./cart-drawer";

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="md:hidden p-2 text-foreground">
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-heading font-semibold tracking-wide text-foreground"
        >
          LUMEN
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {["Collections", "Living", "Dining", "Bedroom"].map((item) => (
            <Link
              key={item}
              href={`/products?category=${item.toLowerCase()}`}
              className="text-sm font-medium tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/account" className="hidden md:block p-2 text-muted-foreground hover:text-foreground transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <CartDrawer />
        </div>
      </div>
    </motion.header>
  );
}

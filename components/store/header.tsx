"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, Menu, User, LogOut, Package, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { CartDrawer } from "./cart-drawer";

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();


  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLoggedIn = status === "authenticated";
  const userName = session?.user?.name;

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

          {/* User icon / dropdown */}
          <div className="hidden md:block relative" ref={userMenuRef}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-foreground text-background text-xs font-heading flex items-center justify-center">
                    {userName?.charAt(0).toUpperCase() || "U"}
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-52 bg-background border border-border shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Account
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        Orders
                      </Link>
                      <Link
                        href="/account?tab=settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t border-border mt-1">
                        <button
                          onClick={() => { setShowUserMenu(false); void signOut({ callbackUrl: "/" }); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Sign in"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          <CartDrawer />
        </div>
      </div>
    </motion.header>
  );
}

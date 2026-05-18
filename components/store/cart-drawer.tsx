"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Aria Lounge Chair",
      price: 1250,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop",
      variant: "Cream, Boucle"
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
        <ShoppingBag className="w-5 h-5" />
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            >
              {itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md border-border bg-background p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-heading text-2xl flex justify-between items-center">
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence>
            {cartItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
                <p className="text-lg font-medium">Your cart is empty.</p>
                <p className="text-muted-foreground">Looks like you haven't added any luxury pieces to your cart yet.</p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-6 border-b border-foreground pb-1 text-sm font-medium uppercase tracking-wider"
                >
                  Continue Shopping
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item.id} 
                    className="flex gap-4"
                  >
                    <div className="relative w-24 h-24 bg-muted shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{item.variant}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-border">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-medium text-primary">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 bg-muted/50 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-xl font-heading font-medium">${subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
            <Link 
              href="/checkout" 
              onClick={() => setIsOpen(false)}
              className="block w-full py-4 bg-foreground text-background text-center text-sm font-medium uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

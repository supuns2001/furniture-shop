"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;          // local key: `${productId}-${variant}`
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string;
  // dbCartItemId is set after a successful DB sync
  dbCartItemId?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "dbCartItemId">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isSyncing: boolean;
  /** Call this after user logs in to merge guest cart → DB */
  syncGuestCartToDb: (userId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "lumen_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedCart) {
          return JSON.parse(savedCart);
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage in initializer:", e);
      }
    }
    return [];
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  // userId will be populated when auth is integrated (e.g. from useSession)
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ─── Persist to localStorage whenever cart changes ──────────────────────
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const buildLocalId = (productId: string, variant: string) =>
    `${productId}-${variant.replace(/\s+/g, "").toLowerCase()}`;

  // ─── Add to Cart ─────────────────────────────────────────────────────────
  const addToCart = useCallback(
    async (newItem: Omit<CartItem, "id" | "dbCartItemId">) => {
      const id = buildLocalId(newItem.productId, newItem.variant);

      // Optimistic local update
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + newItem.quantity } : i
          );
        }
        return [...prev, { ...newItem, id }];
      });

      // DB sync (only when user is logged in)
      if (userId) {
        try {
          setIsSyncing(true);
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              productId: newItem.productId,
              quantity: newItem.quantity,
            }),
          });
          if (res.ok) {
            const dbItem = await res.json();
            // Attach the DB id for future updates/deletes
            setCartItems((prev) =>
              prev.map((i) =>
                i.id === id ? { ...i, dbCartItemId: dbItem.id } : i
              )
            );
          }
        } catch (err) {
          console.error("Cart DB sync failed (addToCart):", err);
        } finally {
          setIsSyncing(false);
        }
      }
    },
    [userId]
  );

  // ─── Remove from Cart ────────────────────────────────────────────────────
  const removeFromCart = useCallback(
    async (id: string) => {
      const item = cartItems.find((i) => i.id === id);

      // Optimistic local update
      setCartItems((prev) => prev.filter((i) => i.id !== id));

      // DB sync
      if (userId && item?.dbCartItemId) {
        try {
          setIsSyncing(true);
          await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItemId: item.dbCartItemId }),
          });
        } catch (err) {
          console.error("Cart DB sync failed (removeFromCart):", err);
        } finally {
          setIsSyncing(false);
        }
      }
    },
    [userId, cartItems]
  );

  // ─── Update Quantity ─────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (quantity < 1) {
        await removeFromCart(id);
        return;
      }

      const item = cartItems.find((i) => i.id === id);

      // Optimistic local update
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );

      // DB sync
      if (userId && item?.dbCartItemId) {
        try {
          setIsSyncing(true);
          await fetch("/api/cart", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItemId: item.dbCartItemId, quantity }),
          });
        } catch (err) {
          console.error("Cart DB sync failed (updateQuantity):", err);
        } finally {
          setIsSyncing(false);
        }
      }
    },
    [userId, cartItems, removeFromCart]
  );

  // ─── Clear Cart ───────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    setCartItems([]);

    if (userId) {
      try {
        setIsSyncing(true);
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, clearAll: true }),
        });
      } catch (err) {
        console.error("Cart DB sync failed (clearCart):", err);
      } finally {
        setIsSyncing(false);
      }
    }
  }, [userId]);

  // ─── Sync guest cart → DB after login ────────────────────────────────────
  const syncGuestCartToDb = useCallback(
    async (loggedInUserId: string) => {
      setUserId(loggedInUserId);

      if (cartItems.length === 0) return;

      setIsSyncing(true);
      try {
        // Push each local cart item to DB
        const syncPromises = cartItems.map((item) =>
          fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: loggedInUserId,
              productId: item.productId,
              quantity: item.quantity,
            }),
          }).then((r) => r.json())
        );

        const results = await Promise.all(syncPromises);

        // Attach dbCartItemId to each local item
        setCartItems((prev) =>
          prev.map((item, idx) => ({
            ...item,
            dbCartItemId: results[idx]?.id,
          }))
        );
      } catch (err) {
        console.error("Guest cart sync to DB failed:", err);
      } finally {
        setIsSyncing(false);
      }
    },
    [cartItems]
  );

  // ─── Derived values ───────────────────────────────────────────────────────
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isSyncing,
        syncGuestCartToDb,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

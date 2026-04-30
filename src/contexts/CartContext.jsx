"use client";

import * as React from "react";

const STORAGE_KEY = "furniqo-cart-v1";

/** @typedef {{
 *   lineId: string;
 *   slug: string;
 *   name: string;
 *   image: string;
 *   price: number;
 *   compareAt: number;
 *   variantLabel?: string | null;
 *   qty: number;
 * }} CartLine */

/** @type {React.Context<{ items: CartLine[]; addItem: (p: Omit<CartLine, "lineId" | "qty"> & { qty?: number }) => void; updateQty: (lineId: string, qty: number) => void; removeLine: (lineId: string) => void; totalQty: number; subtotal: number; openCart: () => void; setCartOpen: (v: boolean) => void; cartOpen: boolean } | null>} */
const CartContext = React.createContext(null);

function lineIdFrom(slug, variantKey) {
  return `${slug}::${variantKey ?? "default"}`;
}

function loadStored() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x) =>
        x &&
        typeof x.lineId === "string" &&
        typeof x.slug === "string" &&
        typeof x.name === "string" &&
        typeof x.price === "number" &&
        typeof x.qty === "number" &&
        x.qty > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = React.useState([]);
  const [hydrated, setHydrated] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);

  React.useEffect(() => {
    setItems(loadStored());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota */
    }
  }, [items, hydrated]);

  const openCart = React.useCallback(() => setCartOpen(true), []);

  const addItem = React.useCallback((payload) => {
    const variantKey = payload.variantLabel ?? "default";
    const lineId = lineIdFrom(payload.slug, variantKey);
    const qtyAdd = Math.max(1, Math.floor(payload.qty ?? 1));
    setItems((prev) => {
      const idx = prev.findIndex((l) => l.lineId === lineId);
      if (idx === -1) {
        return [
          ...prev,
          {
            lineId,
            slug: payload.slug,
            name: payload.name,
            image: payload.image,
            price: payload.price,
            compareAt: payload.compareAt,
            variantLabel: payload.variantLabel ?? null,
            qty: qtyAdd,
          },
        ];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty + qtyAdd };
      return next;
    });
    setCartOpen(true);
  }, []);

  const updateQty = React.useCallback((lineId, qty) => {
    const q = Math.floor(qty);
    if (q < 1) {
      setItems((prev) => prev.filter((l) => l.lineId !== lineId));
      return;
    }
    setItems((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, qty: q } : l)));
  }, []);

  const removeLine = React.useCallback((lineId) => {
    setItems((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const totalQty = React.useMemo(() => items.reduce((s, l) => s + l.qty, 0), [items]);

  const subtotal = React.useMemo(
    () => items.reduce((s, l) => s + l.price * l.qty, 0),
    [items]
  );

  const value = React.useMemo(
    () => ({
      items,
      addItem,
      updateQty,
      removeLine,
      totalQty,
      subtotal,
      openCart,
      setCartOpen,
      cartOpen,
    }),
    [items, addItem, updateQty, removeLine, totalQty, subtotal, openCart, cartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const FREE_SHIPPING_THRESHOLD = 100;

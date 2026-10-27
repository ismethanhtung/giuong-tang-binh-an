"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
    slug: string;
    name: string;
    price: number;
    qty: number;
    variant?: string;
    image?: string;
};

export function getCartLineKey(l: { slug: string; variant?: string }): string {
    return l.variant ? `${l.slug}::${l.variant}` : l.slug;
}

const matchLine = (l: CartLine, keyOrSlug: string) => {
    return (
        getCartLineKey(l) === keyOrSlug || (!l.variant && l.slug === keyOrSlug)
    );
};

type CartContextValue = {
    lines: CartLine[];
    count: number;
    total: number;
    add: (item: Omit<CartLine, "qty">, qty?: number) => void;
    remove: (keyOrSlug: string) => void;
    setQty: (keyOrSlug: string, qty: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "giuongxinh.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [lines, setLines] = useState<CartLine[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setReady(true);
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) setLines(JSON.parse(raw));
            } catch {
                // ignore
            }
        }, 0);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!ready) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
        } catch {
            // ignore
        }
    }, [lines, ready]);

    const value = useMemo<CartContextValue>(() => {
        const count = lines.reduce((s, l) => s + l.qty, 0);
        const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
        return {
            lines,
            count,
            total,
            add: (item, qty = 1) =>
                setLines((prev) => {
                    const targetKey = getCartLineKey(item);
                    const found = prev.find(
                        (l) => getCartLineKey(l) === targetKey,
                    );
                    if (found) {
                        return prev.map((l) =>
                            getCartLineKey(l) === targetKey
                                ? {
                                      ...l,
                                      qty: l.qty + qty,
                                      image: item.image || l.image,
                                  }
                                : l,
                        );
                    }
                    return [...prev, { ...item, qty }];
                }),
            remove: (keyOrSlug) =>
                setLines((prev) =>
                    prev.filter((l) => !matchLine(l, keyOrSlug)),
                ),
            setQty: (keyOrSlug, qty) =>
                setLines((prev) =>
                    qty <= 0
                        ? prev.filter((l) => !matchLine(l, keyOrSlug))
                        : prev.map((l) =>
                              matchLine(l, keyOrSlug) ? { ...l, qty } : l,
                          ),
                ),
            clear: () => setLines([]),
        };
    }, [lines]);

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

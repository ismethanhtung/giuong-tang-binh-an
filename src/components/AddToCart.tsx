"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { CheckIcon, MinusIcon, PlusIcon } from "./icons";

type Item = { slug: string; name: string; price: number };

export function AddToCartIconButton({ item }: { item: Item }) {
    const { add } = useCart();
    const [added, setAdded] = useState(false);

    return (
        <button
            type="button"
            aria-label="Thêm vào giỏ"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                add(item);
                setAdded(true);
                setTimeout(() => setAdded(false), 1200);
            }}
            className={`grid h-9 w-9 place-items-center rounded-full border shadow-2xs transition active:scale-90 ${
                added
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-brand-200 bg-brand-50/70 text-brand-700 hover:bg-brand-600 hover:text-white hover:border-brand-600"
            }`}
        >
            {added ? (
                <CheckIcon className="h-4.5 w-4.5" />
            ) : (
                <PlusIcon className="h-4.5 w-4.5" />
            )}
        </button>
    );
}

export function AddToCartFull({ item }: { item: Item }) {
    const { add, lines, setQty } = useCart();
    const [qty, setLocalQty] = useState(1);
    const [added, setAdded] = useState(false);
    const inCart = lines.find((l) => l.slug === item.slug);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-stone-600">
                    Số lượng
                </span>
                <div className="flex items-center rounded-full border border-stone-200">
                    <button
                        type="button"
                        aria-label="Giảm"
                        onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                        className="grid h-9 w-9 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
                    >
                        <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-stone-900">
                        {qty}
                    </span>
                    <button
                        type="button"
                        aria-label="Tăng"
                        onClick={() => setLocalQty((q) => q + 1)}
                        className="grid h-9 w-9 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
                    >
                        <PlusIcon className="h-4 w-4" />
                    </button>
                </div>
                {inCart ? (
                    <span className="text-xs text-stone-400">
                        (Đã có {inCart.qty} trong giỏ)
                    </span>
                ) : null}
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => {
                        add(item, qty);
                        setAdded(true);
                        setTimeout(() => setAdded(false), 1400);
                    }}
                    className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-bold shadow-lg transition active:scale-95 ${
                        added
                            ? "bg-green-600 text-white shadow-green-600/30"
                            : "bg-brand-600 text-white shadow-brand-600/30 hover:bg-brand-700"
                    }`}
                >
                    {added ? (
                        <>
                            <CheckIcon className="h-5 w-5" />
                            Đã thêm vào giỏ!
                        </>
                    ) : (
                        <>
                            <PlusIcon className="h-5 w-5" />
                            Thêm vào giỏ hàng
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

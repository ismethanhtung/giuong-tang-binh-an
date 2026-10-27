"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { CartIcon, CheckIcon, MinusIcon, PhoneIcon, PlusIcon } from "./icons";
import { site } from "@/lib/site";

type Item = {
    slug: string;
    name: string;
    price: number;
    variant?: string;
    image?: string;
};

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

export function AddToCartFull({
    item,
    showCallButton = true,
}: {
    item: Item;
    showCallButton?: boolean;
}) {
    const { add, lines } = useCart();
    const [qty, setLocalQty] = useState(1);
    const [added, setAdded] = useState(false);
    const inCart = lines.find(
        (l) => l.slug === item.slug && l.variant === item.variant,
    );

    return (
        <div className="flex flex-col gap-2.5">
            {/* Hàng 1: Số lượng & Nút Thêm vào giỏ nằm chung 1 hàng cực kỳ gọn */}
            <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Bộ đếm số lượng */}
                <div className="flex h-11 items-center rounded-xl border border-stone-200 bg-stone-50/80 p-0.5 shrink-0">
                    <button
                        type="button"
                        aria-label="Giảm số lượng"
                        onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                        className="grid h-8 w-8 place-items-center rounded-lg text-stone-600 hover:bg-white hover:shadow-2xs active:scale-95 transition"
                    >
                        <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-stone-800 select-none">
                        {qty}
                    </span>
                    <button
                        type="button"
                        aria-label="Tăng số lượng"
                        onClick={() => setLocalQty((q) => q + 1)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-stone-600 hover:bg-white hover:shadow-2xs active:scale-95 transition"
                    >
                        <PlusIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Nút Thêm vào giỏ hàng */}
                <button
                    type="button"
                    onClick={() => {
                        add(item, qty);
                        setAdded(true);
                        setTimeout(() => setAdded(false), 1400);
                    }}
                    className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm sm:text-[15px] font-bold shadow-sm transition active:scale-[0.98] ${
                        added
                            ? "bg-emerald-600 text-white shadow-emerald-600/20"
                            : "bg-brand-600 text-white shadow-brand-600/20 hover:bg-brand-700"
                    }`}
                >
                    {added ? (
                        <>
                            <CheckIcon className="h-4.5 w-4.5" />
                            <span>Đã thêm ({qty})</span>
                        </>
                    ) : (
                        <>
                            <CartIcon className="h-4.5 w-4.5" />
                            <span>Thêm vào giỏ hàng</span>
                        </>
                    )}
                </button>
            </div>

            {/* Thông báo nếu đã có trong giỏ hàng */}
            {inCart && (
                <div className="text-right text-[11px] text-stone-400">
                    (Đang có {inCart.qty} sản phẩm này trong giỏ hàng)
                </div>
            )}

            {/* Hàng 2: Nút Gọi đặt hàng tinh gọn, rõ ràng */}
            {showCallButton && (
                <a
                    href={site.phoneHref}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-brand-200/80 bg-brand-50/50 text-xs sm:text-sm font-bold text-brand-700 hover:bg-brand-100/60 active:scale-[0.99] transition"
                >
                    <PhoneIcon className="h-4 w-4" />
                    <span>
                        Gọi đặt hàng nhanh:{" "}
                        <strong className="font-extrabold text-brand-800">
                            {site.phone}
                        </strong>
                    </span>
                </a>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import { formatPrice, HIDE_PRICE, type Product } from "@/lib/products";
import { AddToCartFull } from "./AddToCart";

export default function ProductPurchaseSection({
    product,
}: {
    product: Product;
}) {
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants && product.variants.length > 0
            ? product.variants[0]
            : undefined,
    );

    const activePrice = selectedVariant ? selectedVariant.price : product.price;
    const activeOldPrice = selectedVariant?.oldPrice ?? product.oldPrice;

    const discount = activeOldPrice
        ? Math.round((1 - activePrice / activeOldPrice) * 100)
        : 0;

    return (
        <div className="mt-4 min-w-0">
            {/* Box giá bán nổi bật */}
            <div className="flex flex-wrap items-baseline gap-3 rounded-2xl bg-brand-50/70 px-4 py-3">
                <span className="text-2xl font-extrabold text-brand-600 sm:text-3xl">
                    {formatPrice(activePrice)}
                </span>
                {!HIDE_PRICE && activeOldPrice && (
                    <>
                        <span className="text-sm text-stone-400 line-through">
                            {formatPrice(activeOldPrice)}
                        </span>
                        {discount > 0 && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                -{discount}%
                            </span>
                        )}
                    </>
                )}
            </div>

            {/* Bộ chọn kích thước / phân loại nếu có */}
            {product.variants && product.variants.length > 0 && (
                <div className="mt-4 min-w-0">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                            Kích thước:
                        </label>
                        {selectedVariant && (
                            <span className="text-xs font-semibold text-brand-700">
                                Đã chọn: {selectedVariant.label}
                            </span>
                        )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {product.variants.map((v) => {
                            const isSelected =
                                selectedVariant?.label === v.label;
                            return (
                                <button
                                    key={v.label}
                                    type="button"
                                    onClick={() => setSelectedVariant(v)}
                                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                                        isSelected
                                            ? "border-brand-600 bg-brand-50/80 text-brand-700 shadow-xs ring-1 ring-brand-500"
                                            : "border-stone-200 bg-white text-stone-700 hover:border-brand-300 hover:bg-stone-50"
                                    }`}
                                >
                                    <span>{v.label}</span>
                                    {!HIDE_PRICE && (
                                        <span
                                            className={`text-xs ${
                                                isSelected
                                                    ? "font-bold text-brand-600"
                                                    : "text-stone-400"
                                            }`}
                                        >
                                            {formatPrice(v.price)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Khối tác vụ: Số lượng + Thêm vào giỏ hàng + Gọi đặt hàng */}
            <div className="mt-4 min-w-0">
                <AddToCartFull
                    item={{
                        slug: product.slug,
                        name: product.name,
                        price: activePrice,
                        image: product.images?.[0],
                        variant: selectedVariant?.label,
                    }}
                />
            </div>
        </div>
    );
}

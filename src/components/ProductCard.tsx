"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, type Product } from "@/lib/products";
import { AddToCartIconButton } from "./AddToCart";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    const images = product.images ?? [];
    const imageCount = images.length;
    const currentImage =
        images[activeIndex] || (imageCount > 0 ? images[0] : undefined);

    const desc = product.shortDesc || product.description;

    // Tính toán thumbnail hiển thị (tối đa 4 ô)
    // Nếu có > 4 ảnh: 3 ảnh đầu + ô thứ 4 có overlay +N (N = imageCount - 3)
    const showThumbs = imageCount > 1;
    const maxVisibleThumbs = 4;
    const hasMore = imageCount > maxVisibleThumbs;
    const visibleThumbs = showThumbs
        ? hasMore
            ? images.slice(0, 4)
            : images
        : [];
    const remainingCount = imageCount - 3;

    return (
        <div
            onMouseLeave={() => setActiveIndex(0)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xs transition hover:-translate-y-0.5 hover:shadow-md hover:border-brand-300"
        >
            <Link
                href={`/san-pham/${product.slug}`}
                className="flex flex-1 flex-col"
            >
                {/* Ảnh sản phẩm */}
                <div className="relative overflow-hidden bg-stone-100">
                    <ProductImage
                        type={product.type}
                        color={product.color}
                        src={currentImage}
                        alt={product.name}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />

                    {product.badge && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs z-10">
                            {product.badge}
                        </span>
                    )}

                    {/* Badge đếm ảnh thông thường (ẩn khi hover để nhường chỗ cho dải ảnh nhỏ) */}
                    {imageCount > 1 && (
                        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white shadow-sm backdrop-blur transition-opacity duration-200 group-hover:opacity-0 pointer-events-none z-10">
                            <span>📷</span>
                            <span>{imageCount} ảnh</span>
                        </span>
                    )}

                    {/* Dải ảnh nhỏ xuất hiện khi hover vào thẻ hàng */}
                    {showThumbs && (
                        <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-center opacity-0 transition-all duration-200 group-hover:opacity-100 pointer-events-auto">
                            <div className="flex items-center gap-1.5 rounded-xl bg-black/55 p-1 backdrop-blur-md shadow-lg border border-white/15 max-w-full overflow-x-auto no-scrollbar">
                                {visibleThumbs.map((imgSrc, idx) => {
                                    const isFourthSlotWithMore =
                                        hasMore && idx === 3;
                                    const isActive = activeIndex === idx;

                                    return (
                                        <div
                                            key={idx}
                                            onMouseEnter={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setActiveIndex(idx);
                                            }}
                                            title={
                                                isFourthSlotWithMore
                                                    ? `Xem thêm ${remainingCount} ảnh nữa`
                                                    : `Xem ảnh ${idx + 1}`
                                            }
                                            className={`relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all ${
                                                isActive
                                                    ? "ring-2 ring-brand-400 scale-105 z-10 shadow-md"
                                                    : "opacity-80 hover:opacity-100 border border-white/40"
                                            }`}
                                        >
                                            <Image
                                                src={imgSrc}
                                                alt=""
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                            {isFourthSlotWithMore && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-black text-white text-[11px] backdrop-blur-2xs">
                                                    +{remainingCount}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Thông tin sản phẩm */}
                <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                    {/* Tên sản phẩm */}
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-stone-900 group-hover:text-brand-600 transition">
                        {product.name}
                    </h3>

                    {/* Mô tả sản phẩm */}
                    {desc && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500">
                            {desc}
                        </p>
                    )}

                    {/* Khu vực giá bán, giảm giá & nút thêm vào giỏ */}
                    <div className="mt-auto pt-3 border-t border-stone-100 flex items-end justify-between gap-2">
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-base font-extrabold text-brand-600 sm:text-lg whitespace-nowrap">
                                    {formatPrice(product.price)}
                                </span>
                                {discount > 0 && (
                                    <span className="inline-flex items-center rounded-md bg-rose-50 px-1.5 py-0.5 text-[10.5px] font-bold text-rose-600 border border-rose-200/70 leading-none whitespace-nowrap">
                                        -{discount}%
                                    </span>
                                )}
                            </div>
                            {product.oldPrice && (
                                <span className="text-xs text-stone-400 line-through mt-0.5">
                                    {formatPrice(product.oldPrice)}
                                </span>
                            )}
                        </div>

                        <div className="shrink-0">
                            <AddToCartIconButton
                                item={{
                                    slug: product.slug,
                                    name: product.name,
                                    price: product.price,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

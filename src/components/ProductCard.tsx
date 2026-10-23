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
                {/* Ảnh sản phẩm - tăng diện tích hiển thị với tỉ lệ vuông 1:1 */}
                <div className="relative overflow-hidden bg-stone-100">
                    <ProductImage
                        type={product.type}
                        color={product.color}
                        src={currentImage}
                        alt={product.name}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />

                    {product.badge && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs z-10">
                            {product.badge}
                        </span>
                    )}

                    {/* Dải ảnh nhỏ xuất hiện sát mép dưới cùng (bottom-0) khi hover */}
                    {showThumbs && (
                        <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center p-2 bg-gradient-to-t from-black/80 via-black/45 to-transparent opacity-0 transition-all duration-200 group-hover:opacity-100 pointer-events-auto">
                            <div className="flex items-center gap-1.5 justify-center max-w-full overflow-x-auto no-scrollbar">
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
                                            className={`relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all ${
                                                isActive
                                                    ? "ring-2 ring-brand-400 scale-105 z-10 shadow-lg border-2 border-white"
                                                    : "opacity-85 hover:opacity-100 border border-white/70"
                                            }`}
                                        >
                                            <Image
                                                src={imgSrc}
                                                alt=""
                                                fill
                                                className="object-cover"
                                                sizes="44px"
                                            />
                                            {isFourthSlotWithMore && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/65 font-black text-white text-[11px] backdrop-blur-2xs">
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

                {/* Thông tin sản phẩm - tinh gọn tối ưu để nhường không gian cho ảnh */}
                <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                    {/* Tên sản phẩm */}
                    <h3
                        className="line-clamp-1 text-xs sm:text-[13.5px] font-bold leading-snug text-stone-900 group-hover:text-brand-600 transition"
                        title={product.name}
                    >
                        {product.name}
                    </h3>

                    {/* Mô tả sản phẩm (tinh gọn 1 dòng) */}
                    {desc && (
                        <p className="mt-0.5 line-clamp-1 text-[11px] leading-tight text-stone-500">
                            {desc}
                        </p>
                    )}

                    {/* Khu vực giá bán & nút thêm vào giỏ */}
                    <div className="mt-auto pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-extrabold text-brand-600 sm:text-[15px] whitespace-nowrap">
                                    {formatPrice(product.price)}
                                </span>
                                {discount > 0 && (
                                    <span className="inline-flex items-center rounded bg-rose-50 px-1 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200/70 leading-none whitespace-nowrap">
                                        -{discount}%
                                    </span>
                                )}
                            </div>
                            {product.oldPrice && (
                                <span className="text-[11px] text-stone-400 line-through leading-none mt-0.5">
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

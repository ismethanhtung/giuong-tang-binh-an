"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductType } from "@/lib/products";
import ProductImage from "./ProductImage";

type Props = {
    images?: string[];
    productName: string;
    type: ProductType;
    color: string;
};

export default function ProductGallery({
    images = [],
    productName,
    type,
    color,
}: Props) {
    const [activeIdx, setActiveIdx] = useState(0);

    // Nếu không có ảnh thật thì hiển thị hình minh họa vector
    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xs">
                <ProductImage
                    type={type}
                    color={color}
                    alt={productName}
                    className="h-full w-full"
                />
            </div>
        );
    }

    const activeImage = images[activeIdx] || images[0];

    function prev() {
        setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
    }

    function next() {
        setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Khung ảnh chính */}
            <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-sm">
                {/* Lớp nền mờ tự nhiên hài hoà lấp đầy khoảng trống khi ảnh không phải hình vuông */}
                <Image
                    src={activeImage}
                    alt=""
                    fill
                    aria-hidden="true"
                    sizes="120px"
                    className="object-cover blur-2xl scale-125 opacity-35 select-none pointer-events-none"
                />

                {/* Ảnh chính hiển thị full 100% không padding, không cắt xén */}
                <Image
                    src={activeImage}
                    alt={`${productName} - Ảnh ${activeIdx + 1}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain transition-transform duration-300 group-hover:scale-102"
                />

                {/* Badge cam kết ảnh thật */}
                <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Hàng như ảnh chụp thực tế
                </div>

                {/* Bộ đếm ảnh */}
                {images.length > 1 && (
                    <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                        {activeIdx + 1} / {images.length}
                    </div>
                )}

                {/* Nút điều hướng chuyển ảnh */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Ảnh trước"
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-stone-800 shadow-md backdrop-blur transition hover:bg-white active:scale-90"
                        >
                            ❮
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Ảnh tiếp theo"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-stone-800 shadow-md backdrop-blur transition hover:bg-white active:scale-90"
                        >
                            ❯
                        </button>
                    </>
                )}
            </div>

            {/* Danh sách ảnh thu nhỏ (Thumbnails) */}
            {images.length > 1 && (
                <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
                    {images.map((img, idx) => {
                        const isSelected = idx === activeIdx;
                        return (
                            <button
                                key={img}
                                type="button"
                                onClick={() => setActiveIdx(idx)}
                                className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                                    isSelected
                                        ? "border-brand-600 ring-2 ring-brand-400/30 scale-98 bg-stone-100"
                                        : "border-stone-200/80 opacity-75 hover:opacity-100 bg-stone-50"
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt=""
                                    fill
                                    aria-hidden="true"
                                    sizes="40px"
                                    className="object-cover blur-md scale-125 opacity-35 select-none pointer-events-none"
                                />
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    sizes="72px"
                                    className="object-contain"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

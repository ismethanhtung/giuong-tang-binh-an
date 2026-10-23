import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import { AddToCartIconButton } from "./AddToCart";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    const mainImage =
        product.images && product.images.length > 0
            ? product.images[0]
            : undefined;
    const imageCount = product.images?.length ?? 0;

    const desc = product.shortDesc || product.description;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xs transition hover:-translate-y-0.5 hover:shadow-md hover:border-brand-300">
            <Link
                href={`/san-pham/${product.slug}`}
                className="flex flex-1 flex-col"
            >
                {/* Ảnh sản phẩm */}
                <div className="relative overflow-hidden bg-stone-100">
                    <ProductImage
                        type={product.type}
                        color={product.color}
                        src={mainImage}
                        alt={product.name}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    {product.badge && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs">
                            {product.badge}
                        </span>
                    )}
                    {imageCount > 1 && (
                        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white shadow-sm backdrop-blur">
                            <span>📷</span>
                            <span>{imageCount} ảnh</span>
                        </span>
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

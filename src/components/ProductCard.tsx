import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import { AddToCartIconButton } from "./AddToCart";
import ProductImage from "./ProductImage";
import Stars from "./Stars";

export default function ProductCard({ product }: { product: Product }) {
    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    const mainImage =
        product.images && product.images.length > 0
            ? product.images[0]
            : undefined;
    const imageCount = product.images?.length ?? 0;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <Link href={`/san-pham/${product.slug}`} className="block">
                <div className="relative">
                    <ProductImage
                        type={product.type}
                        color={product.color}
                        src={mainImage}
                        alt={product.name}
                        className="aspect-[4/3]"
                    />
                    {product.badge && (
                        <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
                            {product.badge}
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="absolute left-2 top-8 rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
                            -{discount}%
                        </span>
                    )}
                    {imageCount > 1 && (
                        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white shadow-sm backdrop-blur">
                            <span>📷</span>
                            <span>{imageCount} ảnh</span>
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-3 pb-4">
                    <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-stone-800">
                        {product.name}
                    </h3>
                    <Stars rating={product.rating} reviews={product.reviews} />
                    <div className="mt-auto flex items-baseline gap-2 pt-1">
                        <span className="text-base font-bold text-brand-600">
                            {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-xs text-stone-400 line-through">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="absolute bottom-[4.6rem] right-3">
                <AddToCartIconButton
                    item={{
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                    }}
                />
            </div>
        </div>
    );
}

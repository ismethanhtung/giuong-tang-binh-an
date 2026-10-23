import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartFull } from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { ShieldIcon, TruckIcon, WrenchIcon } from "@/components/icons";
import { formatPrice, getCategory } from "@/lib/products";
import {
    getProductBySlugServer,
    getProductsServer,
} from "@/lib/products-server";
import { site } from "@/lib/site";

export function generateStaticParams() {
    const all = getProductsServer();
    return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = getProductBySlugServer(slug);
    if (!product) return { title: "Không tìm thấy sản phẩm" };
    return {
        title: product.name,
        description: product.shortDesc,
    };
}

const trust = [
    { icon: TruckIcon, text: "Giao & lắp đặt tận nhà" },
    { icon: ShieldIcon, text: "Sắt thép Hoà Phát" },
    { icon: WrenchIcon, text: "Hỗ trợ sửa chữa trọn đời" },
];

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = getProductBySlugServer(slug);
    if (!product) notFound();

    const allProducts = getProductsServer();
    const category = getCategory(product.category);
    const related = allProducts
        .filter(
            (p) => p.category === product.category && p.slug !== product.slug,
        )
        .slice(0, 4);
    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    return (
        <div className="mx-auto max-w-6xl px-4">
            <nav className="mt-4 flex flex-wrap items-center text-sm text-stone-400">
                <Link href="/" className="hover:text-brand-600">
                    Trang chủ
                </Link>
                <span className="mx-1.5">/</span>
                <Link
                    href={`/san-pham?danh-muc=${product.category}`}
                    className="hover:text-brand-600"
                >
                    {category?.short}
                </Link>
                <span className="mx-1.5">/</span>
                <span className="truncate text-stone-600">{product.name}</span>
            </nav>

            <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-10">
                <div className="md:sticky md:top-24 md:self-start">
                    <ProductGallery
                        images={product.images}
                        productName={product.name}
                        type={product.type}
                        color={product.color}
                    />
                </div>

                <div>
                    {product.badge && (
                        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                            {product.badge}
                        </span>
                    )}
                    <h1 className="mt-2 text-2xl font-extrabold leading-snug tracking-tight text-stone-900 sm:text-3xl">
                        {product.name}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-baseline gap-3 rounded-2xl bg-brand-50/70 px-4 py-3">
                        <span className="text-2xl font-extrabold text-brand-600 sm:text-3xl">
                            {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                            <>
                                <span className="text-sm text-stone-400 line-through">
                                    {formatPrice(product.oldPrice)}
                                </span>
                                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                    -{discount}%
                                </span>
                            </>
                        )}
                    </div>

                    <p className="mt-4 text-[15px] leading-relaxed text-stone-600">
                        {product.shortDesc}
                    </p>

                    <div className="mt-5">
                        <AddToCartFull
                            item={{
                                slug: product.slug,
                                name: product.name,
                                price: product.price,
                            }}
                        />
                    </div>

                    <a
                        href={site.phoneHref}
                        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-brand-200 bg-white text-[15px] font-bold text-brand-700 transition active:scale-[0.98] hover:bg-brand-50"
                    >
                        Gọi đặt hàng: {site.phone}
                    </a>

                    <div className="mt-6 grid grid-cols-3 gap-2 border-y border-stone-200/80 py-4">
                        {trust.map((t) => (
                            <div
                                key={t.text}
                                className="flex flex-col items-center gap-1.5 text-center"
                            >
                                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
                                    <t.icon className="h-5 w-5" />
                                </span>
                                <span className="text-xs font-medium text-stone-700">
                                    {t.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Chi tiết mô tả sản phẩm */}
                    {product.description && (
                        <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50/60 p-4 sm:p-5">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                                Mô tả sản phẩm
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-stone-600 whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>
                    )}

                    <div className="mt-6">
                        <h2 className="text-sm font-bold text-stone-900">
                            Thông số kỹ thuật
                        </h2>
                        <dl className="mt-3 divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-stone-50/50 text-sm">
                            {product.specs.map((s) => (
                                <div
                                    key={s.label}
                                    className="flex justify-between px-4 py-2.5"
                                >
                                    <dt className="text-stone-500">
                                        {s.label}
                                    </dt>
                                    <dd className="font-semibold text-stone-800">
                                        {s.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-xl font-bold tracking-tight text-stone-900">
                        Sản phẩm tương tự
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {related.map((p) => (
                            <ProductCard key={p.slug} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

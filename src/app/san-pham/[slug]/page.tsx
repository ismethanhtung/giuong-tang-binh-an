import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchaseSection from "@/components/ProductPurchaseSection";
import { BadgeCheckIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { getCategory } from "@/lib/products";
import { site } from "@/lib/site";
import {
    JsonLd,
    getProductSchema,
    getBreadcrumbSchema,
} from "@/components/JsonLd";
import {
    getProductBySlugServer,
    getProductsServer,
} from "@/lib/products-server";

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

    const category = getCategory(product.category);
    const pageUrl = `${site.url}/san-pham/${product.slug}`;
    const pageTitle = `${product.name} – Giá Xưởng Tốt Nhất`;
    const pageDescription =
        product.description ||
        `${product.name} tại Giường tầng Bình An (Pleiku, Gia Lai). ${product.shortDesc}. Bảo hành chu đáo, giao lắp tận nơi.`;

    const ogImages =
        product.images && product.images.length > 0
            ? product.images.map((img) => ({
                  url: img.startsWith("http") ? img : `${site.url}${img}`,
                  alt: product.name,
              }))
            : [{ url: `${site.url}/images/anh-nen.jpg`, alt: product.name }];

    return {
        title: pageTitle,
        description: pageDescription,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title: pageTitle,
            description: pageDescription,
            url: pageUrl,
            siteName: site.name,
            locale: "vi_VN",
            type: "article",
            images: ogImages,
        },
        twitter: {
            card: "summary_large_image",
            title: pageTitle,
            description: pageDescription,
            images: [ogImages[0].url],
        },
    };
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = getProductBySlugServer(slug);
    if (!product) notFound();

    const isIron =
        product.category === "giuong-sat" ||
        product.name.toLowerCase().includes("sắt") ||
        Boolean(product.material?.toLowerCase().includes("sắt"));

    const materialText = isIron ? "Sắt thép Hoà Phát" : "Chất lượng cao";

    const trust = [
        { icon: TruckIcon, text: "Giao & lắp đặt tận nhà" },
        { icon: BadgeCheckIcon, text: materialText },
        { icon: ShieldIcon, text: "An toàn chắc chắn" },
    ];

    const allProducts = getProductsServer();
    const category = getCategory(product.category);
    const related = allProducts
        .filter(
            (p) => p.category === product.category && p.slug !== product.slug,
        )
        .slice(0, 4);

    const productSchema = getProductSchema(product, category);
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Trang chủ", url: "/" },
        {
            name: category?.name || "Sản phẩm",
            url: `/san-pham?danh-muc=${product.category}`,
        },
        { name: product.name, url: `/san-pham/${product.slug}` },
    ]);

    return (
        <div className="mx-auto w-full min-w-0 max-w-6xl px-4">
            <JsonLd data={productSchema} />
            <JsonLd data={breadcrumbSchema} />

            <nav className="mt-4 flex items-center text-sm text-stone-400 min-w-0">
                <Link href="/" className="shrink-0 hover:text-brand-600">
                    Trang chủ
                </Link>
                <span className="mx-1.5 shrink-0">/</span>
                <Link
                    href={`/san-pham?danh-muc=${product.category}`}
                    className="shrink-0 hover:text-brand-600"
                >
                    {category?.short}
                </Link>
                <span className="mx-1.5 shrink-0">/</span>
                <span className="truncate min-w-0 text-stone-600">{product.name}</span>
            </nav>

            <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-10 min-w-0">
                <div className="min-w-0 md:sticky md:top-24 md:self-start">
                    <ProductGallery
                        images={product.images}
                        productName={product.name}
                        type={product.type}
                        color={product.color}
                    />
                </div>

                <div className="min-w-0">
                    <h1 className="mb-2 text-2xl font-extrabold leading-snug tracking-tight text-stone-900 sm:text-3xl">
                        {product.name}
                    </h1>

                    {product.shortDesc && (
                        <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                            {product.shortDesc}
                        </p>
                    )}

                    {/* Khu vực chọn phân loại / kích thước & mua hàng */}
                    <ProductPurchaseSection product={product} />

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

import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/products";
import { getProductsServer } from "@/lib/products-server";
import { matchSearch } from "@/lib/search";
import { site } from "@/lib/site";
import { JsonLd, getBreadcrumbSchema } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

type Search = { q?: string; "danh-muc"?: string };

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<Search>;
}): Promise<Metadata> {
    const sp = await searchParams;
    const activeCat = sp["danh-muc"];
    const q = sp.q?.trim();
    const active = categories.find((c) => c.id === activeCat);

    let title = "Tất cả sản phẩm nội thất";
    let description =
        "Xem danh sách các mẫu giường tầng sắt hộp Hoà Phát, giường sắt, giường gỗ, tủ quần áo, bàn ghế giá xưởng tại Pleiku, Gia Lai. Giao lắp tận nhà.";

    if (activeCat === "giuong-sat") {
        title = "Giường Tầng Sắt, Giường Sắt Hộp Hoà Phát Giá Xưởng Gia Lai";
        description =
            "Xưởng sản xuất giường tầng sắt, giường sắt tầng, giường sắt hộp Hoà Phát sơn tĩnh điện bền đẹp tại Pleiku, Gia Lai. Đủ kích thước 1m, 1m2, 1m4, 1m6, giá tận xưởng.";
    } else if (active) {
        title = `${active.name} Giá Xưởng Bền Đẹp Tại Gia Lai`;
        description = `Khám phá các mẫu ${active.name.toLowerCase()} bền đẹp, chất lượng cao tại xưởng Giường tầng Bình An (Pleiku, Gia Lai). Đầy đủ kích thước, mẫu mã đa dạng, giá tận xưởng tốt nhất.`;
    } else if (q) {
        title = `Tìm kiếm: "${q}"`;
        description = `Kết quả tìm kiếm sản phẩm cho từ khóa "${q}" tại Giường tầng Bình An.`;
    }

    const canonicalUrl = activeCat
        ? `${site.url}/san-pham?danh-muc=${activeCat}`
        : `${site.url}/san-pham`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${title} | ${site.name}`,
            description,
            url: canonicalUrl,
            siteName: site.name,
            locale: "vi_VN",
            type: "website",
            images: [
                {
                    url: "/images/anh-nen.jpg",
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
    };
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<Search>;
}) {
    const sp = await searchParams;
    const activeCat = sp["danh-muc"];
    const q = sp.q?.trim() ?? "";

    const active = categories.find((c) => c.id === activeCat);

    const products = getProductsServer();
    let list = products;
    if (active) list = list.filter((p) => p.category === active.id);
    if (q) {
        list = list.filter((p) => {
            const searchableText = `${p.name} ${p.shortDesc} ${p.description || ""} ${p.specs?.map((s) => `${s.label} ${s.value}`).join(" ") || ""}`;
            return matchSearch(searchableText, q);
        });
    }

    const buildHref = (catId?: string) => {
        const params = new URLSearchParams();
        if (catId) params.set("danh-muc", catId);
        if (q) params.set("q", q);
        const s = params.toString();
        return s ? `/san-pham?${s}` : "/san-pham";
    };

    const breadcrumbs = [
        { name: "Trang chủ", url: "/" },
        {
            name: active ? active.name : "Sản phẩm",
            url: activeCat ? `/san-pham?danh-muc=${activeCat}` : "/san-pham",
        },
    ];

    return (
        <div className="mx-auto w-full max-w-6xl px-4">
            <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />

            <nav className="mt-4 text-sm text-stone-400">
                <Link href="/" className="hover:text-brand-600">
                    Trang chủ
                </Link>
                <span className="mx-1.5">/</span>
                <span className="text-stone-600">
                    {active ? active.name : "Sản phẩm"}
                </span>
            </nav>

            <header className="mt-3">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900">
                    {activeCat === "giuong-sat"
                        ? "Giường Tầng Sắt, Giường Sắt Hộp Tại Gia Lai"
                        : active
                          ? `${active.name} Giá Xưởng – Bình An Gia Lai`
                          : q
                            ? `Kết quả tìm kiếm cho: "${q}"`
                            : "Giường Tầng, Giường Sắt & Nội Thất Bình An"}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-stone-500">
                    {q ? (
                        <>
                            Tìm thấy{" "}
                            <span className="font-semibold text-stone-700">
                                {list.length}
                            </span>{" "}
                            sản phẩm cho từ khoá “{q}”
                        </>
                    ) : activeCat === "giuong-sat" ? (
                        "Xưởng sản xuất giường tầng sắt, giường sắt đơn Hoà Phát sơn tĩnh điện giá tận xưởng tại Pleiku, Gia Lai."
                    ) : (
                        `Tổng hợp ${list.length} sản phẩm nội thất chất lượng, bảo hành chu đáo, giao lắp tận nơi tại Gia Lai.`
                    )}
                </p>
            </header>

            <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
                <Link
                    href={buildHref()}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        !active
                            ? "bg-brand-600 text-white shadow"
                            : "border border-stone-200 bg-white text-stone-600 hover:border-brand-300"
                    }`}
                >
                    Tất cả
                </Link>
                {categories.map((c) => (
                    <Link
                        key={c.id}
                        href={buildHref(c.id)}
                        className={`shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                            active?.id === c.id
                                ? "bg-brand-600 text-white shadow"
                                : "border border-stone-200 bg-white text-stone-600 hover:border-brand-300"
                        }`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={c.icon}
                            alt={c.name}
                            className="h-4.5 w-4.5 shrink-0 object-contain"
                        />
                        {c.short}
                    </Link>
                ))}
            </div>

            {list.length === 0 ? (
                <div className="mt-16 flex flex-col items-center text-center">
                    <span className="text-5xl">🔍</span>
                    <p className="mt-4 font-semibold text-stone-700">
                        Không tìm thấy sản phẩm phù hợp
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                        Thử từ khoá khác hoặc xem tất cả sản phẩm.
                    </p>
                    <Link
                        href="/san-pham"
                        className="mt-5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white"
                    >
                        Xem tất cả
                    </Link>
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-2 gap-3 pb-4 sm:gap-4 lg:grid-cols-4">
                    {list.map((p, idx) => (
                        <ProductCard
                            key={p.slug}
                            product={p}
                            priority={idx < 4}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

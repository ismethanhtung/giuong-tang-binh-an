import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartFull } from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import Stars from "@/components/Stars";
import { ShieldIcon, TruckIcon, WrenchIcon } from "@/components/icons";
import {
  formatPrice,
  getCategory,
  getProduct,
  products,
} from "@/lib/products";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  return {
    title: product.name,
    description: product.shortDesc,
  };
}

const trust = [
  { icon: TruckIcon, text: "Giao & lắp đặt tận nhà" },
  { icon: ShieldIcon, text: "Bảo hành chính hãng" },
  { icon: WrenchIcon, text: "Hỗ trợ sửa chữa trọn đời" },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
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
          <ProductImage
            type={product.type}
            color={product.color}
            alt={product.name}
            className="aspect-square rounded-3xl border border-stone-200"
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
          <div className="mt-2">
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>

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

          <div className="mt-5 grid gap-2 rounded-2xl border border-stone-200 p-4">
            {trust.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-stone-600">
                <Icon className="h-5 w-5 text-brand-600" />
                {text}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-base font-bold text-stone-900">Thông số</h2>
            <dl className="mt-3 divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200">
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-3 gap-2 px-4 py-3 text-sm">
                  <dt className="text-stone-500">{s.label}</dt>
                  <dd className="col-span-2 font-medium text-stone-800">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-lg font-bold tracking-tight text-stone-900">
            Sản phẩm cùng loại
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 pb-4 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

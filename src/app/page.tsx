import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { ChevronRightIcon, PhoneIcon, StarIcon } from "@/components/icons";
import { categories, products } from "@/lib/products";
import { site } from "@/lib/site";

export default function HomePage() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const rest = products.filter((p) => !p.featured).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 text-white shadow-xl shadow-brand-900/10">
        <div className="grid items-center gap-6 p-6 sm:p-10 md:grid-cols-2">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <StarIcon className="h-3.5 w-3.5 text-amber-300" />
              Xưởng sản xuất trực tiếp – giá gốc
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Giường sắt & nội thất gỗ
              <br />
              <span className="text-amber-200">bền đẹp, giá xưởng</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              Giường tầng, giường sắt, giường gỗ, tủ và bàn ghế ăn. Bảo hành dài,
              lắp đặt tận nhà, giao hàng toàn quốc.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/san-pham"
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-bold text-brand-700 shadow-lg transition active:scale-95 hover:bg-amber-50"
              >
                Xem sản phẩm
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-bold text-white transition active:scale-95 hover:bg-white/10"
              >
                <PhoneIcon className="h-4 w-4" />
                {site.phone}
              </a>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <ProductImage
                type="bunk"
                color="#e7b078"
                showHint={false}
                alt="Giường tầng sắt"
                className="aspect-[4/3] rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-stone-900">
            Danh mục
          </h2>
          <Link
            href="/san-pham"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Tất cả
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/san-pham?danh-muc=${c.id}`}
              className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm transition hover:border-brand-300 hover:shadow-md sm:w-auto"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl">
                {c.emoji}
              </span>
              <span className="text-xs font-semibold leading-snug text-stone-700">
                {c.short}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-stone-900">
              Sản phẩm nổi bật
            </h2>
            <p className="text-sm text-stone-500">
              Được khách chọn nhiều nhất tuần này
            </p>
          </div>
          <Link
            href="/san-pham"
            className="hidden text-sm font-semibold text-brand-600 hover:text-brand-700 sm:block"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-brand-100 bg-brand-50/60 p-6 text-center sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
          Cần tư vấn chọn giường phù hợp?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-stone-600">
          Gọi hoặc chat Zalo, chúng tôi tư vấn kích thước, màu sắc và báo giá
          trong vài phút.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={site.phoneHref}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition active:scale-95 hover:bg-brand-700"
          >
            <PhoneIcon className="h-4 w-4" />
            Gọi {site.phone}
          </a>
          <a
            href={site.zalo}
            className="inline-flex h-11 items-center rounded-full border border-brand-200 bg-white px-5 text-sm font-bold text-brand-700 transition active:scale-95 hover:bg-brand-50"
          >
            Chat Zalo
          </a>
        </div>
      </section>

      {/* More products */}
      <section className="mt-12">
        <h2 className="text-lg font-bold tracking-tight text-stone-900">
          Có thể bạn cũng thích
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {rest.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

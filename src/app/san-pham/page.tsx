import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

type Search = { q?: string; "danh-muc"?: string };

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export const metadata = {
  title: "Sản phẩm",
  description: "Danh sách giường sắt, giường tầng, giường gỗ, tủ và bàn ghế ăn.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const activeCat = sp["danh-muc"];
  const q = sp.q?.trim() ?? "";

  const active = categories.find((c) => c.id === activeCat);

  let list = products;
  if (active) list = list.filter((p) => p.category === active.id);
  if (q) {
    const nq = normalize(q);
    list = list.filter(
      (p) =>
        normalize(p.name).includes(nq) || normalize(p.shortDesc).includes(nq),
    );
  }

  const buildHref = (catId?: string) => {
    const params = new URLSearchParams();
    if (catId) params.set("danh-muc", catId);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/san-pham?${s}` : "/san-pham";
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <nav className="mt-4 text-sm text-stone-400">
        <Link href="/" className="hover:text-brand-600">
          Trang chủ
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-stone-600">{active ? active.name : "Sản phẩm"}</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
          {active ? active.name : "Tất cả sản phẩm"}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {q ? (
            <>
              Kết quả cho “<span className="font-medium text-stone-700">{q}</span>” —{" "}
            </>
          ) : null}
          {list.length} sản phẩm
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
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              active?.id === c.id
                ? "bg-brand-600 text-white shadow"
                : "border border-stone-200 bg-white text-stone-600 hover:border-brand-300"
            }`}
          >
            <span className="mr-1">{c.emoji}</span>
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
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

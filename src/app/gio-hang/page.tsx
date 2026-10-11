"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/components/CartProvider";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { formatPrice, getProduct } from "@/lib/products";
import { site } from "@/lib/site";

export default function CartPage() {
  const { lines, total, setQty, remove, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="mt-5 text-2xl font-bold">Giỏ hàng trống</h1>
        <p className="mt-2 text-sm text-stone-500">
          Chưa có sản phẩm nào trong giỏ. Xem ngay các mẫu giường và nội thất.
        </p>
        <Link
          href="/san-pham"
          className="mt-6 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition active:scale-95 hover:bg-brand-700"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Giỏ hàng{" "}
          <span className="text-base font-medium text-stone-400">
            ({lines.length} sản phẩm)
          </span>
        </h1>
        <button
          type="button"
          onClick={clear}
          className="text-sm font-medium text-stone-400 hover:text-red-500"
        >
          Xoá tất cả
        </button>
      </div>

      <div className="mt-4 grid gap-6 pb-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-3">
          {lines.map((line) => {
            const product = getProduct(line.slug);
            return (
              <div
                key={line.slug}
                className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:gap-4"
              >
                <Link
                  href={`/san-pham/${line.slug}`}
                  className="shrink-0 overflow-hidden"
                >
                  <ProductImage
                    type={product?.type ?? "bed"}
                    color={product?.color ?? "#c2703a"}
                    alt={line.name}
                    showHint={false}
                    className="h-24 w-24 rounded-xl sm:h-28 sm:w-28"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/san-pham/${line.slug}`}
                      className="line-clamp-2 text-sm font-semibold text-stone-800 hover:text-brand-600"
                    >
                      {line.name}
                    </Link>
                    <button
                      type="button"
                      aria-label="Xoá sản phẩm"
                      onClick={() => remove(line.slug)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <TrashIcon className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2 sm:pt-3">
                    <div className="flex items-center rounded-full border border-stone-200">
                      <button
                        type="button"
                        aria-label="Giảm"
                        onClick={() => setQty(line.slug, line.qty - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Tăng"
                        onClick={() => setQty(line.slug, line.qty + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-brand-600">
                      {formatPrice(line.price * line.qty)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-bold text-stone-900">Tổng tiền</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between text-stone-500">
              <dt>Tạm tính</dt>
              <dd className="font-medium text-stone-700">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between text-stone-500">
              <dt>Phí giao nội thành</dt>
              <dd className="font-medium text-green-600">Miễn phí</dd>
            </div>
            <div className="mt-3 flex justify-between border-t border-dashed border-stone-200 pt-3 text-base">
              <dt className="font-bold text-stone-900">Thành tiền</dt>
              <dd className="font-extrabold text-brand-600">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
          <a
            href={site.phoneHref}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-brand-600 text-[15px] font-bold text-white shadow-lg shadow-brand-600/20 transition active:scale-[0.98] hover:bg-brand-700"
          >
            Xác nhận đặt hàng
          </a>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-stone-400">
            Demo: hoàn tất đơn hàng bằng cuộc gọi / Zalo tới {site.phone}.
          </p>
        </aside>
      </div>
    </div>
  );
}
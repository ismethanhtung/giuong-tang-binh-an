"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { CheckIcon, MinusIcon, PlusIcon } from "./icons";

type Item = { slug: string; name: string; price: number };

export function AddToCartIconButton({ item }: { item: Item }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      aria-label="Thêm vào giỏ"
      onClick={() => {
        add(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className={`grid h-9 w-9 place-items-center rounded-full shadow-md transition ${
        added
          ? "bg-green-600 text-white"
          : "bg-white text-brand-600 hover:bg-brand-600 hover:text-white"
      }`}
    >
      {added ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
    </button>
  );
}

export function AddToCartFull({ item }: { item: Item }) {
  const { add, lines, setQty } = useCart();
  const [qty, setLocalQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = lines.find((l) => l.slug === item.slug);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-stone-600">Số lượng</span>
        <div className="flex items-center rounded-full border border-stone-200">
          <button
            type="button"
            aria-label="Giảm"
            onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
            className="grid h-9 w-9 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            aria-label="Tăng"
            onClick={() => setLocalQty((q) => Math.min(20, q + 1))}
            className="grid h-9 w-9 place-items-center rounded-full text-stone-600 hover:bg-stone-100"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          add(item, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-[15px] font-bold text-white shadow-lg shadow-brand-600/20 transition active:scale-[0.98] hover:bg-brand-700"
      >
        {added ? (
          <>
            <CheckIcon className="h-5 w-5" /> Đã thêm vào giỏ
          </>
        ) : (
          <>Thêm vào giỏ hàng</>
        )}
      </button>

      {inCart && (
        <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-2.5 text-sm text-stone-600">
          <span>Đang có {inCart.qty} trong giỏ</span>
          <button
            type="button"
            onClick={() => setQty(item.slug, 0)}
            className="font-medium text-brand-600"
          >
            Xoá
          </button>
        </div>
      )}
    </div>
  );
}

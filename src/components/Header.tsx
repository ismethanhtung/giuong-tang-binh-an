"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { CartIcon, PhoneIcon, SearchIcon } from "./icons";

export default function Header() {
  const { count } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/san-pham?q=${encodeURIComponent(q.trim())}` : "/san-pham");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-lg text-white shadow-sm">
            🛏️
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-stone-900">
              {site.name}
            </span>
            <span className="hidden text-[11px] text-stone-500 sm:block">
              {site.tagline}
            </span>
          </span>
        </Link>

        <form
          onSubmit={submit}
          className="ml-2 hidden flex-1 items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 focus-within:border-brand-400 focus-within:bg-white sm:flex"
        >
          <SearchIcon className="h-4.5 w-4.5 text-stone-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm giường sắt, giường tầng, tủ gỗ..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
          />
        </form>

        <div className="ml-auto flex items-center gap-1.5">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-full bg-brand-50 px-3.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 md:flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {site.phone}
          </a>
          <Link
            href="/gio-hang"
            aria-label="Giỏ hàng"
            className="relative grid h-10 w-10 place-items-center rounded-full text-stone-700 hover:bg-stone-100"
          >
            <CartIcon className="h-5.5 w-5.5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-t border-stone-200/70 bg-white px-4 py-2 sm:hidden"
      >
        <SearchIcon className="h-4.5 w-4.5 text-stone-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm giường, tủ, bàn ghế..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
        />
      </form>
    </header>
  );
}

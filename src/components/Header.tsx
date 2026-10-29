"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import ConsultModal from "./ConsultModal";
import { useCart } from "./CartProvider";
import { CartIcon, PhoneIcon, SearchIcon, XIcon } from "./icons";
import Logo from "./Logo";
import VietnamFlag from "./VietnamFlag";

export default function Header() {
    const { count } = useCart();
    const router = useRouter();
    const [q, setQ] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isConsultOpen, setIsConsultOpen] = useState(false);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchOpen && mobileInputRef.current) {
            mobileInputRef.current.focus();
        }
    }, [isSearchOpen]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = q.replace(/\s+/g, " ").trim();
        if (trimmed) {
            router.push(`/san-pham?q=${encodeURIComponent(trimmed)}`);
            setIsSearchOpen(false);
        } else {
            router.push("/san-pham");
        }
    }

    return (
        <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/85 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16">
                {/* Khi mở tìm kiếm trên mobile: Thanh tìm kiếm chiếm toàn bộ chiều ngang header */}
                {isSearchOpen ? (
                    <form
                        onSubmit={submit}
                        className="flex flex-1 items-center gap-2 sm:hidden animate-in fade-in zoom-in-95 duration-150"
                    >
                        <div className="flex flex-1 items-center gap-2 rounded-full border border-brand-400 bg-stone-50 px-3.5 py-1.5 focus-within:bg-white shadow-xs">
                            <SearchIcon className="h-4 w-4 text-brand-600 shrink-0" />
                            <input
                                ref={mobileInputRef}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Tìm giường, tủ, bàn ghế..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                            />
                            {q && (
                                <button
                                    type="button"
                                    onClick={() => setQ("")}
                                    className="text-stone-400 hover:text-stone-600 p-0.5"
                                >
                                    <XIcon className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSearchOpen(false);
                                setQ("");
                            }}
                            className="text-xs font-semibold text-stone-500 hover:text-stone-800 px-1 py-1"
                        >
                            Đóng
                        </button>
                    </form>
                ) : (
                    <>
                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <Logo />
                            <span className="leading-tight">
                                <span className="flex items-center gap-1.5 text-[15px] font-bold tracking-tight text-stone-900">
                                    {site.name}
                                    <VietnamFlag className="h-4 w-4" />
                                </span>
                                <span className="hidden text-[11px] text-stone-500 sm:block">
                                    {site.tagline}
                                </span>
                            </span>
                        </Link>

                        {/* Thanh tìm kiếm trên máy tính (desktop/tablet) */}
                        <form
                            onSubmit={submit}
                            className="ml-2 hidden flex-1 items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-1.5 focus-within:border-brand-400 focus-within:bg-white sm:flex"
                        >
                            <SearchIcon className="h-4.5 w-4.5 text-stone-400" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Tìm giường sắt, giường tầng, tủ gỗ..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                            />
                        </form>

                        <div className="ml-auto flex items-center gap-1">
                            {/* Nút kính lúp mở tìm kiếm trên mobile */}
                            <button
                                type="button"
                                aria-label="Tìm kiếm sản phẩm"
                                onClick={() => setIsSearchOpen(true)}
                                className="grid h-10 w-10 place-items-center rounded-full text-stone-700 hover:bg-stone-100 sm:hidden transition active:scale-95"
                            >
                                <SearchIcon className="h-5 w-5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsConsultOpen(true)}
                                className="hidden items-center gap-2 rounded-full bg-brand-50 px-3.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 md:flex transition active:scale-95"
                            >
                                <PhoneIcon className="h-4 w-4" />
                                Liên hệ & Tư vấn
                            </button>

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
                    </>
                )}
            </div>

            <ConsultModal
                isOpen={isConsultOpen}
                onClose={() => setIsConsultOpen(false)}
            />
        </header>
    );
}

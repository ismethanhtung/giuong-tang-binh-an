import Link from "next/link";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import {
    ClockIcon,
    FacebookIcon,
    MapPinIcon,
    MessengerIcon,
    PhoneIcon,
    ZaloIcon,
} from "./icons";
import Logo from "./Logo";
import VietnamFlag from "./VietnamFlag";

export default function Footer() {
    return (
        <footer className="mt-auto w-full border-t border-stone-200/80 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-12 md:gap-8">
                    {/* Cột 1: Thương hiệu & Mạng xã hội (5 cols trên desktop, full width trên mobile) */}
                    <div className="sm:col-span-2 md:col-span-5">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5"
                        >
                            <Logo />
                            <span className="leading-tight">
                                <span className="flex items-center gap-1.5 text-base font-bold tracking-tight text-stone-900">
                                    {site.name}
                                    <VietnamFlag className="h-4 w-4" />
                                </span>
                                <span className="block text-xs text-stone-500">
                                    {site.tagline}
                                </span>
                            </span>
                        </Link>
                        <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-stone-500">
                            {site.description}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-brand-700">
                            🇻🇳 Tự hào hàng Việt Nam chất lượng cao
                        </p>

                        {/* Mạng xã hội */}
                        <div className="mt-3.5 flex items-center gap-2.5">
                            <a
                                href={site.zalo}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat qua Zalo"
                                aria-label="Zalo"
                                className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-stone-50/80 text-[#0068FF] transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 active:scale-95"
                            >
                                <ZaloIcon className="w-5.5 h-auto text-[#0068FF]" />
                            </a>
                            <a
                                href={site.messenger}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat qua Messenger"
                                aria-label="Messenger"
                                className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-stone-50/80 text-[#0084FF] transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 active:scale-95"
                            >
                                <MessengerIcon className="h-4.5 w-4.5" />
                            </a>
                            <a
                                href={site.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Xem trang Facebook"
                                aria-label="Facebook"
                                className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-stone-50/80 text-[#1877F2] transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 active:scale-95"
                            >
                                <FacebookIcon className="h-4.5 w-4.5" />
                            </a>
                        </div>
                    </div>

                    {/* Cột 2 & Cột 3: Chia 2 cột song song ngay trên màn hình di động/tablet nhỏ */}
                    <div className="grid grid-cols-2 gap-4 sm:col-span-2 md:contents">
                        {/* Danh mục sản phẩm */}
                        <div className="md:col-span-3">
                            <p className="text-sm font-bold tracking-tight text-stone-900">
                                Danh mục sản phẩm
                            </p>
                            <ul className="mt-2.5 space-y-2 text-sm md:mt-4 md:space-y-2.5">
                                {categories.map((c) => (
                                    <li key={c.id}>
                                        <Link
                                            href={`/san-pham?danh-muc=${c.id}`}
                                            className="text-stone-500 transition hover:text-brand-600"
                                        >
                                            {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Liên hệ & Địa chỉ */}
                        <div className="md:col-span-4">
                            <p className="text-sm font-bold tracking-tight text-stone-900">
                                Liên hệ & Địa chỉ
                            </p>

                            <ul className="mt-2.5 space-y-2 text-sm text-stone-600 md:mt-4 md:space-y-2.5">
                                {/* Hotline / Zalo */}
                                <li>
                                    <span className="text-stone-500">Hotline / Zalo: </span>
                                    <a
                                        href={site.phoneHref}
                                        className="font-semibold text-stone-900 transition hover:text-brand-600"
                                    >
                                        {site.phone}
                                    </a>
                                </li>

                                {/* Giờ mở cửa */}
                                <li>
                                    <span className="text-stone-500">Mở cửa: </span>
                                    <span className="text-stone-800">
                                        {site.hours}
                                    </span>
                                </li>

                                {/* Địa chỉ xưởng */}
                                <li className="leading-relaxed">
                                    <span className="text-stone-500">Địa chỉ: </span>
                                    <span className="text-stone-700">
                                        {site.address}
                                    </span>
                                    <a
                                        href={site.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-1 inline-flex items-center text-xs font-semibold text-brand-600 transition hover:text-brand-700 hover:underline"
                                    >
                                        (Xem bản đồ & chỉ đường ↗)
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thanh bản quyền ở đáy */}
            <div className="border-t border-stone-100 py-4.5 pb-20 md:pb-4.5 text-center text-xs text-stone-400">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4">
                    <span>© 2026 {site.name}.</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-stone-600">
                        <VietnamFlag className="h-3.5 w-3.5" />
                        Tự hào hàng Việt Nam chất lượng cao.
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">
                        Cam kết hàng như ảnh, đúng chất lượng, an toàn chắc
                        chắn.
                    </span>
                </div>
            </div>
        </footer>
    );
}

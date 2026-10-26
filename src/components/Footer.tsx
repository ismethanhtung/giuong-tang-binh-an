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
        <footer className="mt-16 border-t border-stone-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Cột 1: Thông tin thương hiệu & Mạng xã hội */}
                    <div className="md:col-span-2">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2"
                        >
                            <Logo />
                            <span className="leading-tight">
                                <span className="flex items-center gap-1.5 text-[15px] font-bold tracking-tight text-stone-900">
                                    {site.name}
                                    <VietnamFlag className="h-4 w-4" />
                                </span>
                                <span className="block text-[11px] text-stone-500">
                                    {site.tagline}
                                </span>
                            </span>
                        </Link>
                        <p className="mt-3 max-w-sm text-sm text-stone-500">
                            {site.description}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-brand-700">
                            🇻🇳 Tự hào hàng Việt Nam chất lượng cao
                        </p>

                        {/* Mạng xã hội: 3 nút đồng đều trên 1 hàng */}
                        <div className="mt-4 grid max-w-xs grid-cols-3 gap-2">
                            <a
                                href={site.zalo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-sky-200/80 bg-sky-50/70 px-1.5 text-[11.5px] font-semibold text-sky-900 shadow-2xs transition active:scale-95 hover:border-sky-300 hover:bg-sky-100"
                            >
                                <ZaloIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>Zalo</span>
                            </a>
                            <a
                                href={site.messenger}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-blue-200/80 bg-blue-50/70 px-1.5 text-[11.5px] font-semibold text-blue-900 shadow-2xs transition active:scale-95 hover:border-blue-300 hover:bg-blue-100"
                            >
                                <MessengerIcon className="h-3.5 w-3.5 shrink-0 text-[#0084FF]" />
                                <span>Messenger</span>
                            </a>
                            <a
                                href={site.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-indigo-200/80 bg-indigo-50/70 px-1.5 text-[11.5px] font-semibold text-indigo-900 shadow-2xs transition active:scale-95 hover:border-indigo-300 hover:bg-indigo-100"
                            >
                                <FacebookIcon className="h-3.5 w-3.5 shrink-0 text-[#1877F2]" />
                                <span>Facebook</span>
                            </a>
                        </div>
                    </div>

                    {/* Cột 2: Danh mục */}
                    <div>
                        <p className="text-sm font-semibold text-stone-800">
                            Danh mục
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-stone-500">
                            {categories.map((c) => (
                                <li key={c.id}>
                                    <Link
                                        href={`/san-pham?danh-muc=${c.id}`}
                                        className="hover:text-brand-600"
                                    >
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 3: Liên hệ & Địa chỉ */}
                    <div>
                        <p className="text-sm font-semibold text-stone-800">
                            Liên hệ & Địa chỉ
                        </p>
                        <ul className="mt-3 space-y-2.5 text-sm text-stone-600">
                            <li className="flex items-center gap-2.5">
                                <PhoneIcon className="h-4.5 w-4.5 shrink-0 text-brand-600" />
                                <a
                                    href={site.phoneHref}
                                    className="font-semibold text-stone-900 hover:text-brand-600"
                                >
                                    {site.phone}
                                </a>
                                <span className="text-xs text-stone-400">
                                    (Hotline / Zalo)
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                                <div>
                                    <span className="font-semibold text-stone-800">
                                        Địa chỉ mới:
                                    </span>{" "}
                                    <span>{site.address}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-stone-400" />
                                <div className="text-stone-500">
                                    <span className="font-medium text-stone-700">
                                        Địa chỉ cũ:
                                    </span>{" "}
                                    <span>{site.oldAddress}</span>
                                </div>
                            </li>

                            {/* Nút mở Google Maps theo toạ độ chính xác 14.00035, 107.9963 */}
                            <li className="pt-0.5">
                                <a
                                    href={site.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 shadow-2xs transition hover:border-brand-300 hover:bg-brand-100"
                                >
                                    <MapPinIcon className="h-4 w-4 text-brand-600" />
                                    Mở Google Maps (Chỉ đường) →
                                </a>
                            </li>

                            <li className="flex items-center gap-2.5 pt-1">
                                <ClockIcon className="h-4.5 w-4.5 shrink-0 text-brand-600" />
                                <span>
                                    <span className="font-medium text-stone-700">
                                        Thời gian phục vụ:
                                    </span>{" "}
                                    <span className="inline-block rounded-md bg-brand-50 px-2 py-0.5 font-bold text-brand-700">
                                        {site.hours}
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-stone-100 py-5 text-center text-xs text-stone-500">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span>© 2026 {site.name}.</span>
                    <span className="inline-flex items-center gap-1 font-medium text-stone-700">
                        <VietnamFlag className="h-3.5 w-3.5" />
                        Tự hào hàng Việt Nam chất lượng cao.
                    </span>
                    <span>
                        Cam kết hàng như ảnh, đúng chất lượng, an toàn chắc
                        chắn.
                    </span>
                </div>
            </div>
        </footer>
    );
}

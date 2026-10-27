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
        <footer className="mt-auto border-t border-stone-200 bg-white">
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

                        {/* Mạng xã hội: các nút icon tròn tối giản, thanh lịch, chuẩn giao diện hiện đại */}
                        <div className="mt-4 flex items-center gap-2.5">
                            <a
                                href={site.zalo}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat qua Zalo"
                                aria-label="Zalo"
                                className="grid h-9 w-9 place-items-center rounded-full border border-stone-200/90 bg-stone-50 text-[#0068FF] transition-all hover:-translate-y-0.5 hover:border-[#0068FF] hover:bg-sky-50 hover:shadow-2xs active:scale-95"
                            >
                                <ZaloIcon className="w-6 h-auto text-[#0068FF]" />
                            </a>
                            <a
                                href={site.messenger}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat qua Messenger"
                                aria-label="Messenger"
                                className="grid h-9 w-9 place-items-center rounded-full border border-stone-200/90 bg-stone-50 text-[#0084FF] transition-all hover:-translate-y-0.5 hover:border-[#0084FF] hover:bg-blue-50 hover:shadow-2xs active:scale-95"
                            >
                                <MessengerIcon className="h-4.5 w-4.5" />
                            </a>
                            <a
                                href={site.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Xem trang Facebook"
                                aria-label="Facebook"
                                className="grid h-9 w-9 place-items-center rounded-full border border-stone-200/90 bg-stone-50 text-[#1877F2] transition-all hover:-translate-y-0.5 hover:border-[#1877F2] hover:bg-indigo-50 hover:shadow-2xs active:scale-95"
                            >
                                <FacebookIcon className="h-4.5 w-4.5" />
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

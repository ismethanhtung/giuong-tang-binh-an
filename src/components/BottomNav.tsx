"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ConsultModal from "./ConsultModal";
import { useCart } from "./CartProvider";
import { CartIcon, GridIcon, HomeIcon, PhoneCallIcon } from "./icons";

const items = [
    { href: "/", label: "Trang chủ", icon: HomeIcon },
    { href: "/san-pham", label: "Sản phẩm", icon: GridIcon },
    { href: "/gio-hang", label: "Giỏ hàng", icon: CartIcon },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { count } = useCart();
    const [isConsultOpen, setIsConsultOpen] = useState(false);

    return (
        <>
            {/* Style định nghĩa chuyển động đổi màu gradient mịn màng của nền nút liên hệ và nhịp rung của icon điện thoại */}
            <style>{`
                @keyframes ambientAuraShift {
                    0% {
                        filter: hue-rotate(0deg) blur(8px);
                        transform: scale(0.96);
                    }
                    50% {
                        filter: hue-rotate(180deg) blur(11px);
                        transform: scale(1.04);
                    }
                    100% {
                        filter: hue-rotate(360deg) blur(8px);
                        transform: scale(0.96);
                    }
                }

                @keyframes phoneRingCycle {
                    0%, 100% {
                        transform: rotate(0deg) scale(1);
                    }
                    3% {
                        transform: rotate(-14deg) scale(1.1);
                    }
                    6% {
                        transform: rotate(14deg) scale(1.1);
                    }
                    9% {
                        transform: rotate(-14deg) scale(1.1);
                    }
                    12% {
                        transform: rotate(14deg) scale(1.1);
                    }
                    15% {
                        transform: rotate(-8deg) scale(1.05);
                    }
                    18% {
                        transform: rotate(8deg) scale(1.05);
                    }
                    22% {
                        transform: rotate(0deg) scale(1);
                    }
                }
            `}</style>

            <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
                <div className="mx-auto grid max-w-md grid-cols-4 h-14 items-center">
                    {items.map(({ href, label, icon: Icon }) => {
                        const active =
                            href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`relative flex flex-col items-center justify-center gap-0.5 py-1 text-[11px] font-medium transition ${
                                    active ? "text-brand-600 font-semibold" : "text-stone-500"
                                }`}
                            >
                                <Icon className="h-6 w-6" />
                                <span>{label}</span>
                                {href === "/gio-hang" && count > 0 && (
                                    <span className="absolute right-[18%] top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white shadow-xs">
                                        {count}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => setIsConsultOpen(true)}
                        className="relative flex flex-col items-center justify-center gap-0.5 py-1 text-[11px] text-brand-700 active:scale-95 transition cursor-pointer"
                    >
                        {/* Lớp nền hào quang tròn trịa to hơn, đổi màu êm dịu theo thời gian và mờ dần ra ngoài */}
                        <div
                            className="pointer-events-none absolute rounded-full opacity-85"
                            style={{
                                width: "72px",
                                height: "72px",
                                top: "calc(50% - 36px)",
                                left: "calc(50% - 36px)",
                                background:
                                    "radial-gradient(circle at center, rgba(19, 144, 123, 0.46) 0%, rgba(14, 165, 233, 0.32) 45%, rgba(245, 158, 11, 0.16) 72%, transparent 95%)",
                                animation: "ambientAuraShift 7s ease-in-out infinite",
                                transformOrigin: "center center",
                                willChange: "filter, transform",
                            }}
                        />

                        <div className="relative z-10">
                            <PhoneCallIcon
                                className="h-6 w-6 text-brand-700"
                                style={{
                                    animation: "phoneRingCycle 3.2s ease-in-out infinite",
                                    transformOrigin: "center center",
                                }}
                            />
                            {/* Chấm trực tuyến tinh tế */}
                            <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>
                        <span className="relative z-10 font-bold text-brand-800">Liên hệ</span>
                    </button>
                </div>
            </nav>

            <ConsultModal
                isOpen={isConsultOpen}
                onClose={() => setIsConsultOpen(false)}
            />
        </>
    );
}

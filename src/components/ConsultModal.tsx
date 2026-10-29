"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import {
    FacebookIcon,
    MessengerIcon,
    PhoneIcon,
    XIcon,
    ZaloIcon,
} from "./icons";

interface ConsultModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConsultModal({ isOpen, onClose }: ConsultModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Khóa cuộn trang nền khi mở modal và lắng nghe phím ESC để đóng
    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            {/* Lớp nền tối mờ phủ toàn màn hình */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Khung nội dung modal nằm ở vị trí trung tâm */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl transition-all">
                {/* Header của Modal */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                        <h3 className="text-base font-bold text-stone-900">
                            Tư vấn & Đặt hàng
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Liên hệ trực tiếp để được tư vấn nhanh nhất
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Danh sách 4 phương thức liên hệ */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {/* Gọi điện thoại */}
                    <a
                        href={site.phoneHref}
                        className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-3 text-stone-800 transition active:scale-95 hover:bg-white hover:border-brand-500 hover:text-brand-600"
                    >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                            <PhoneIcon className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs text-stone-500">Gọi ngay</div>
                            <div className="text-xs font-bold leading-tight">
                                {site.phone}
                            </div>
                        </div>
                    </a>

                    {/* Zalo */}
                    <a
                        href={site.zalo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-3 text-stone-800 transition active:scale-95 hover:bg-white hover:border-[#0068FF] hover:text-[#0068FF]"
                    >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-50 text-[#0068FF]">
                            <ZaloIcon className="w-5 h-auto" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs text-stone-500">Nhắn tin</div>
                            <div className="text-xs font-bold leading-tight">
                                Zalo
                            </div>
                        </div>
                    </a>

                    {/* Messenger */}
                    <a
                        href={site.messenger}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-3 text-stone-800 transition active:scale-95 hover:bg-white hover:border-[#0084FF] hover:text-[#0084FF]"
                    >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0084FF]">
                            <MessengerIcon className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs text-stone-500">Nhắn tin</div>
                            <div className="text-xs font-bold leading-tight">
                                Messenger
                            </div>
                        </div>
                    </a>

                    {/* Facebook */}
                    <a
                        href={site.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-3 text-stone-800 transition active:scale-95 hover:bg-white hover:border-[#1877F2] hover:text-[#1877F2]"
                    >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-[#1877F2]">
                            <FacebookIcon className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs text-stone-500">Ghé thăm</div>
                            <div className="text-xs font-bold leading-tight">
                                Facebook
                            </div>
                        </div>
                    </a>
                </div>

                {/* Mục đến trực tiếp xem hàng tại kho */}
                <div className="mt-3.5 border-t border-stone-100 pt-3">
                    <div className="rounded-2xl bg-brand-50/80 p-3 text-center">
                        <div className="text-xs font-bold text-brand-800">
                            Kho luôn sẵn hàng, đến kho xem ngay
                        </div>
                        <div className="mt-1 text-[11px] text-stone-600 leading-snug">
                            {site.address}
                        </div>
                        <a
                            href={site.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 underline transition hover:text-brand-800"
                        >
                            Xem vị trí & chỉ đường Google Maps ↗
                        </a>

                        {/* Minimap bản đồ đặt ngay dưới dòng chữ chỉ đường */}
                        <div className="mt-2.5 overflow-hidden rounded-xl border border-brand-200/60 bg-stone-100 shadow-2xs">
                            <iframe
                                title="Bản đồ vị trí kho hàng"
                                src={`https://maps.google.com/maps?q=${site.coordinates.lat},${site.coordinates.lng}&hl=vi&z=15&output=embed`}
                                className="h-28 w-full border-0 block"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

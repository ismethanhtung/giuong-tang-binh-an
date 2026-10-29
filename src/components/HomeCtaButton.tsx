"use client";

import { useState } from "react";
import { PhoneIcon } from "./icons";
import ConsultModal from "./ConsultModal";

export default function HomeCtaButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition active:scale-95 hover:bg-brand-700"
            >
                <PhoneIcon className="h-4.5 w-4.5" />
                Liên hệ ngay
            </button>

            <ConsultModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

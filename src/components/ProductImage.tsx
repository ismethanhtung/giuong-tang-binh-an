import Image from "next/image";
import type { ProductType } from "@/lib/products";

type Props = {
    type: ProductType;
    color: string;
    src?: string;
    className?: string;
    alt?: string;
    showHint?: boolean;
    priority?: boolean;
};

function Illustration({ type, color }: { type: ProductType; color: string }) {
    const dark = "rgba(28,25,23,0.75)";
    const shade = "rgba(28,25,23,0.18)";

    if (type === "bunk") {
        return (
            <g>
                <rect
                    x="150"
                    y="96"
                    width="200"
                    height="34"
                    rx="6"
                    fill={color}
                />
                <rect
                    x="150"
                    y="168"
                    width="200"
                    height="26"
                    rx="6"
                    fill={color}
                />
                <rect
                    x="150"
                    y="252"
                    width="200"
                    height="26"
                    rx="6"
                    fill={color}
                />
                <rect
                    x="156"
                    y="206"
                    width="70"
                    height="26"
                    rx="8"
                    fill="#fff"
                    stroke={shade}
                />
                <rect
                    x="156"
                    y="118"
                    width="70"
                    height="28"
                    rx="8"
                    fill="#fff"
                    stroke={shade}
                />
                <rect
                    x="120"
                    y="88"
                    width="16"
                    height="220"
                    rx="8"
                    fill={dark}
                />
                <rect
                    x="364"
                    y="88"
                    width="16"
                    height="220"
                    rx="8"
                    fill={dark}
                />
                <g stroke={dark} strokeWidth="9" strokeLinecap="round">
                    <line x1="238" y1="110" x2="238" y2="196" />
                    <line x1="268" y1="110" x2="268" y2="196" />
                    <line x1="232" y1="140" x2="274" y2="140" />
                    <line x1="232" y1="172" x2="274" y2="172" />
                </g>
            </g>
        );
    }

    if (type === "bed") {
        return (
            <g>
                <rect
                    x="96"
                    y="130"
                    width="30"
                    height="150"
                    rx="6"
                    fill={color}
                />
                <rect
                    x="126"
                    y="196"
                    width="212"
                    height="24"
                    rx="6"
                    fill={color}
                />
                <rect
                    x="126"
                    y="220"
                    width="200"
                    height="18"
                    rx="4"
                    fill={shade}
                />
                <rect
                    x="150"
                    y="170"
                    width="74"
                    height="26"
                    rx="8"
                    fill="#fff"
                    stroke={shade}
                />
                <rect
                    x="120"
                    y="264"
                    width="14"
                    height="46"
                    rx="6"
                    fill={dark}
                />
                <rect
                    x="318"
                    y="264"
                    width="14"
                    height="46"
                    rx="6"
                    fill={dark}
                />
                <rect
                    x="230"
                    y="170"
                    width="90"
                    height="26"
                    rx="8"
                    fill={color}
                    opacity="0.5"
                />
            </g>
        );
    }

    if (type === "wardrobe") {
        return (
            <g>
                <rect
                    x="140"
                    y="70"
                    width="220"
                    height="220"
                    rx="12"
                    fill={color}
                />
                <rect
                    x="140"
                    y="70"
                    width="220"
                    height="220"
                    rx="12"
                    fill="none"
                    stroke={dark}
                    strokeWidth="6"
                />
                <line
                    x1="250"
                    y1="70"
                    x2="250"
                    y2="290"
                    stroke={dark}
                    strokeWidth="5"
                />
                <line
                    x1="140"
                    y1="176"
                    x2="360"
                    y2="176"
                    stroke={dark}
                    strokeWidth="5"
                />
                <circle cx="238" cy="180" r="6" fill={dark} />
                <circle cx="262" cy="180" r="6" fill={dark} />
                <rect
                    x="156"
                    y="290"
                    width="16"
                    height="26"
                    rx="5"
                    fill={dark}
                />
                <rect
                    x="328"
                    y="290"
                    width="16"
                    height="26"
                    rx="5"
                    fill={dark}
                />
            </g>
        );
    }

    if (type === "table") {
        return (
            <g>
                <rect
                    x="104"
                    y="170"
                    width="240"
                    height="20"
                    rx="8"
                    fill={color}
                />
                <rect
                    x="104"
                    y="170"
                    width="240"
                    height="20"
                    rx="8"
                    fill="none"
                    stroke={dark}
                    strokeWidth="4"
                />
                <rect
                    x="130"
                    y="190"
                    width="16"
                    height="96"
                    rx="6"
                    fill={dark}
                />
                <rect
                    x="302"
                    y="190"
                    width="16"
                    height="96"
                    rx="6"
                    fill={dark}
                />
                <g fill={color} stroke={dark} strokeWidth="4">
                    <rect x="70" y="206" width="40" height="10" rx="4" />
                    <rect x="70" y="216" width="10" height="70" rx="4" />
                    <rect x="100" y="216" width="10" height="70" rx="4" />
                    <rect x="338" y="206" width="40" height="10" rx="4" />
                    <rect x="338" y="216" width="10" height="70" rx="4" />
                    <rect x="368" y="216" width="10" height="70" rx="4" />
                </g>
            </g>
        );
    }

    return (
        <g>
            <rect x="140" y="150" width="120" height="18" rx="8" fill={color} />
            <rect
                x="150"
                y="80"
                width="100"
                height="74"
                rx="10"
                fill={color}
                opacity="0.85"
            />
            <rect
                x="150"
                y="80"
                width="100"
                height="74"
                rx="10"
                fill="none"
                stroke={dark}
                strokeWidth="5"
            />
            <rect x="152" y="168" width="14" height="106" rx="6" fill={dark} />
            <rect x="240" y="168" width="14" height="106" rx="6" fill={dark} />
            <rect
                x="176"
                y="168"
                width="10"
                height="96"
                rx="5"
                fill={dark}
                opacity="0.6"
            />
        </g>
    );
}

export default function ProductImage({
    type,
    color,
    src,
    className = "",
    alt = "",
    showHint = true,
    priority = false,
}: Props) {
    if (src) {
        return (
            <div
                className={`relative overflow-hidden bg-stone-100 ${className}`}
            >
                {/* Lớp nền mờ lấy trực tiếp màu sắc/ảnh gốc để lấp đầy khoảng thiếu một cách hài hoà */}
                <Image
                    src={src}
                    alt=""
                    fill
                    aria-hidden="true"
                    sizes="60px"
                    className="object-cover blur-xl scale-125 opacity-35 select-none pointer-events-none"
                />

                {/* Ảnh chính hiển thị trọn vẹn 100% full ảnh, không bị cắt xén bất cứ chi tiết nào */}
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-contain p-1 sm:p-1.5 transition-transform duration-300 group-hover:scale-103"
                />

                {showHint && (
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-emerald-800 shadow-sm backdrop-blur">
                        hàng như ảnh
                    </span>
                )}
            </div>
        );
    }

    const id = `bg-${type}`;
    return (
        <div className={`relative overflow-hidden bg-brand-50/70 ${className}`}>
            <svg
                viewBox="0 0 480 380"
                preserveAspectRatio="xMidYMid slice"
                role="img"
                aria-label={alt}
                className="h-full w-full"
            >
                <defs>
                    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#eef8f5" />
                    </linearGradient>
                </defs>
                <rect width="480" height="380" fill={`url(#${id})`} />
                <ellipse
                    cx="240"
                    cy="330"
                    rx="170"
                    ry="20"
                    fill="rgba(28,25,23,0.06)"
                />
                <Illustration type={type} color={color} />
            </svg>
            {showHint && (
                <span className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-emerald-800 shadow-sm backdrop-blur">
                    hàng như ảnh
                </span>
            )}
        </div>
    );
}

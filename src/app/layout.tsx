import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { CartProvider } from "@/components/CartProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/lib/site";

const beVietnam = Be_Vietnam_Pro({
    variable: "--font-be-vietnam",
    subsets: ["latin", "vietnamese"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: `${site.name} – ${site.tagline}`,
        template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: [
        "giường tầng Bình An",
        "giường sắt",
        "giường tầng",
        "giường gỗ",
        "tủ gỗ",
        "bàn ghế ăn",
        "nội thất Gia Lai",
        "nội thất Pleiku",
    ],
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", sizes: "32x32" },
        ],
        shortcut: "/favicon.svg",
        apple: "/icon-192.png",
    },
    openGraph: {
        title: `${site.name} – ${site.tagline}`,
        description: site.description,
        type: "website",
    },
};

export const viewport: Viewport = {
    themeColor: "#13907b",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
            <body className="flex min-h-screen flex-col bg-[#f8fafc] text-stone-800">
                <CartProvider>
                    <Header />
                    <main className="flex flex-1 flex-col pb-20 md:pb-12">
                        {children}
                    </main>
                    <Footer />
                    <BottomNav />
                </CartProvider>
            </body>
        </html>
    );
}

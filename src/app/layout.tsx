import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { CartProvider } from "@/components/CartProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/lib/site";
import { JsonLd, getLocalBusinessSchema, getWebSiteSchema } from "@/components/JsonLd";

const beVietnam = Be_Vietnam_Pro({
    variable: "--font-be-vietnam",
    subsets: ["latin", "vietnamese"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: {
        default: `${site.name} – ${site.tagline}`,
        template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: [
        "giường tầng",
        "giường tầng Bình An",
        "giường sắt",
        "giường sắt tầng",
        "giường sắt gia lai",
        "giường tầng gia lai",
        "giuong tang gia lai",
        "giuong sat gia lai",
        "giuong tang binh an",
        "giuong sat binh an",
        "giuong sat tang",
        "giường sắt hộp gia lai",
        "giường tầng sắt pleiku",
        "xưởng giường sắt pleiku",
        "giường tầng hộp hoà phát gia lai",
        "giường sắt bọc nệm",
        "giường gỗ pleiku",
        "tủ quần áo gia lai",
        "bàn ghế ăn pleiku",
        "nội thất gia lai",
        "nội thất pleiku",
        "mua giường tầng tại pleiku",
        "nội thất tây nguyên",
    ],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    formatDetection: {
        telephone: true,
        address: true,
        email: true,
    },
    alternates: {
        canonical: "/",
    },
    verification: {
        google: "_x_x6oArUNlfAp9hgBY1REYa0COPxxfT_4yqTIJsj0k",
    },
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
        url: site.url,
        siteName: site.name,
        locale: "vi_VN",
        type: "website",
        images: [
            {
                url: "/images/anh-nen.jpg",
                width: 1200,
                height: 630,
                alt: `${site.name} - Giường tầng sắt & nội thất giá xưởng Pleiku Gia Lai`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${site.name} – ${site.tagline}`,
        description: site.description,
        images: ["/images/anh-nen.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    other: {
        "geo.region": "VN-30",
        "geo.placename": "Pleiku",
        "geo.position": `${site.coordinates.lat};${site.coordinates.lng}`,
        ICBM: `${site.coordinates.lat}, ${site.coordinates.lng}`,
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
    const localBusinessData = getLocalBusinessSchema();

    return (
        <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
            <head>
                <meta
                    name="google-site-verification"
                    content="_x_x6oArUNlfAp9hgBY1REYa0COPxxfT_4yqTIJsj0k"
                />
                <JsonLd data={localBusinessData} />
                <JsonLd data={getWebSiteSchema()} />
            </head>
            <body className="flex min-h-screen flex-col bg-[#f8fafc] text-stone-800 overflow-x-clip">
                <CartProvider>
                    <Header />
                    <main className="w-full flex-1 pb-20 md:pb-12">
                        {children}
                    </main>
                    <Footer />
                    <BottomNav />
                </CartProvider>
            </body>
        </html>
    );
}

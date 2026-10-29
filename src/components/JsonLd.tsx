import { site } from "@/lib/site";
import type { Product, Category } from "@/lib/products";

/**
 * Schema LocalBusiness & FurnitureStore dành cho cửa hàng / xưởng nội thất
 * Cung cấp đầy đủ thông tin chuẩn Google Local & Knowledge Graph
 */
export function getLocalBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": ["FurnitureStore", "HomeGoodsStore"],
        "@id": `${site.url}/#store`,
        name: "Giường tầng Bình An Gia Lai",
        alternateName: [
            "Giường tầng, giường sắt & nội thất: Giường tầng Bình An Gia Lai",
            "Giường tầng Bình An",
            "Giường tầng Gia Lai",
            "Giường sắt Gia Lai",
            "Giường sắt tầng Bình An",
            "Giường tầng sắt Bình An Pleiku Gia Lai",
            "Xưởng giường sắt Bình An",
            "Xưởng Giường Tầng Pleiku",
        ],
        description: site.description,
        url: site.url,
        logo: `${site.url}/icon-192.png`,
        image: [
            `${site.url}/images/anh-nen.jpg`,
            `${site.url}/icon-192.png`,
        ],
        telephone: site.phone,
        priceRange: site.priceRange,
        currenciesAccepted: "VND",
        paymentAccepted: "Tiền mặt, Chuyển khoản ngân hàng",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Số 03 hẻm 250 đường Phạm Văn Đồng, Phường Thống Nhất",
            addressLocality: site.addressLocality,
            addressRegion: site.addressRegion,
            postalCode: site.postalCode,
            addressCountry: site.addressCountry,
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: site.coordinates.lat,
            longitude: site.coordinates.lng,
        },
        hasMap: site.mapUrl,
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                opens: "07:00",
                closes: "22:00",
            },
        ],
        sameAs: [site.facebook, site.zalo, site.messenger],
        knowsAbout: [
            "Giường tầng",
            "Giường tầng sắt",
            "Giường sắt",
            "Giường sắt tầng",
            "Giường sắt gia lai",
            "Giường tầng gia lai",
            "Giường tầng sắt hộp Hoà Phát",
            "Giường sắt bọc nệm",
            "Nội thất Gia Lai",
            "Nội thất Pleiku",
        ],
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Danh mục sản phẩm xưởng Giường tầng Bình An",
            itemListElement: [
                {
                    "@type": "OfferCatalog",
                    name: "Giường sắt & giường tầng",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Product",
                                name: "Giường tầng sắt hộp Hoà Phát Pleiku Gia Lai",
                                description: "Giường tầng sắt hộp cao cấp, chịu tải 500kg, đủ kích thước 1m, 1m2, 1m4, 1m6, có hộc kéo và thang hộp.",
                            },
                        },
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Product",
                                name: "Giường sắt đơn và giường sắt bọc nệm Gia Lai",
                                description: "Giường sắt sơn tĩnh điện Hoà Phát, mẫu mã hiện đại, chống rỉ sét, độ bền cao.",
                            },
                        },
                    ],
                },
                {
                    "@type": "OfferCatalog",
                    name: "Nội thất gỗ",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Product",
                                name: "Giường gỗ tự nhiên và tủ quần áo Gia Lai",
                            },
                        },
                    ],
                },
            ],
        },
        areaServed: [
            {
                "@type": "City",
                name: "Pleiku",
            },
            {
                "@type": "AdministrativeArea",
                name: "Gia Lai",
            },
            {
                "@type": "AdministrativeArea",
                name: "Kon Tum",
            },
            {
                "@type": "AdministrativeArea",
                name: "Đắk Lắk",
            },
            {
                "@type": "AdministrativeArea",
                name: "Tây Nguyên",
            },
            {
                "@type": "Country",
                name: "Việt Nam",
            },
        ],
    };
}

/**
 * Schema Product chi tiết cho Google Merchant & Rich Snippets
 */
export function getProductSchema(product: Product, category?: Category) {
    const productUrl = `${site.url}/san-pham/${product.slug}`;
    const images =
        product.images && product.images.length > 0
            ? product.images.map((img) =>
                  img.startsWith("http") ? img : `${site.url}${img}`,
              )
            : [`${site.url}/images/anh-nen.jpg`];

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description || product.shortDesc,
        image: images,
        url: productUrl,
        sku: product.slug,
        brand: {
            "@type": "Brand",
            name: site.name,
        },
        category: category?.name || "Nội thất",
        material: product.material || "Sắt sơn tĩnh điện",
        offers: {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: "VND",
            price: product.price,
            availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
            itemCondition: "https://schema.org/NewCondition",
            seller: {
                "@type": "Organization",
                name: site.name,
            },
            priceValidUntil: "2027-12-31",
            shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                    "@type": "MonetaryAmount",
                    value: "0",
                    currency: "VND",
                },
                shippingDestination: {
                    "@type": "DefinedRegion",
                    addressCountry: "VN",
                    addressRegion: "Gia Lai",
                },
            },
        },
    };
}

/**
 * Schema BreadcrumbList hỗ trợ hiển thị đường dẫn phân cấp trang trên Google
 */
export function getBreadcrumbSchema(
    items: { name: string; url: string }[],
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http")
                ? item.url
                : `${site.url}${item.url}`,
        })),
    };
}

/**
 * Schema WebSite kèm Sitelinks Searchbox
 */
export function getWebSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "Giường tầng Bình An Gia Lai",
        alternateName: "Giường tầng, giường sắt & nội thất: Giường tầng Bình An Gia Lai",
        description: site.description,
        inLanguage: "vi-VN",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${site.url}/san-pham?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

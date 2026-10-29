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
        name: site.name,
        alternateName: [
            "Giường tầng sắt Bình An Pleiku Gia Lai",
            "Xưởng giường sắt Bình An",
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

export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

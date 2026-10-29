import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories } from "@/lib/products";
import { getProductsServer } from "@/lib/products-server";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = site.url;
    const now = new Date();

    // 1. Trang tĩnh chính
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/san-pham`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/gio-hang`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.5,
        },
    ];

    // 2. Trang danh mục sản phẩm (/san-pham?danh-muc=...)
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${baseUrl}/san-pham?danh-muc=${cat.id}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.85,
    }));

    // 3. Toàn bộ trang chi tiết sản phẩm
    const products = getProductsServer();
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${baseUrl}/san-pham/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

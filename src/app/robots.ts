import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = site.url;

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/quan-ly", "/api/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

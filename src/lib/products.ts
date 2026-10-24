import rawProducts from "@/data/products.json";

export type CategoryId =
    "giuong-sat" | "giuong-go" | "tu-go" | "ban-ghe" | "khac";

export type ProductType = "bunk" | "bed" | "wardrobe" | "table" | "chair";

export type Category = {
    id: CategoryId;
    name: string;
    short: string;
    emoji: string;
    icon: string;
};

export type Product = {
    id?: string;
    slug: string;
    name: string;
    category: CategoryId;
    type: ProductType;
    price: number;
    oldPrice?: number;
    rating?: number;
    reviews?: number;
    badge?: string;
    featured?: boolean;
    shortDesc: string;
    description?: string;
    imageFolder?: string;
    images?: string[];
    color: string;
    specs: { label: string; value: string }[];
    material?: string;
    warranty?: string;
    inStock?: boolean;
};

export const categories: Category[] = [
    {
        id: "giuong-sat",
        name: "Giường sắt & giường tầng",
        short: "Giường sắt",
        emoji: "🛏️",
        icon: "/icons/giuong-sat.png",
    },
    {
        id: "giuong-go",
        name: "Giường gỗ",
        short: "Giường gỗ",
        emoji: "🪵",
        icon: "/icons/giuong-go.gif",
    },
    {
        id: "tu-go",
        name: "Tủ gỗ",
        short: "Tủ gỗ",
        emoji: "🚪",
        icon: "/icons/tu-go.gif",
    },
    {
        id: "ban-ghe",
        name: "Bàn ghế",
        short: "Bàn ghế",
        emoji: "🍽️",
        icon: "/icons/ban-ghe.gif",
    },
    {
        id: "khac",
        name: "Khác",
        short: "Khác",
        emoji: "🛋️",
        icon: "/icons/khac.gif",
    },
];

export function getCategory(id: CategoryId): Category | undefined {
    return categories.find((c) => c.id === id);
}

export function formatPrice(vnd: number): string {
    return new Intl.NumberFormat("vi-VN").format(vnd) + "₫";
}

export const products: Product[] = rawProducts as unknown as Product[];

export function getProduct(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
}

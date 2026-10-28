import fs from "fs";
import path from "path";
import type { CategoryId, Product, ProductType } from "./products";
import initialProducts from "@/data/products.json";

const DATA_FILE = path.join(process.cwd(), "src/data/products.json");
const IMAGES_DIR = path.join(process.cwd(), "public/images");

const VALID_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

/**
 * Lấy danh sách URL ảnh thực tế từ một thư mục con trong public/images/
 * Ví dụ: imageFolder = "giuong/giuongtangkhonghocm2m4"
 */
export function getImagesFromFolder(imageFolder?: string): string[] {
    if (!imageFolder) return [];

    // Chuẩn hoá đường dẫn
    const cleanFolder = imageFolder.replace(/^images\//, "").replace(/^\//, "");
    const folderPath = path.join(IMAGES_DIR, cleanFolder);

    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        return [];
    }

    try {
        const files = fs.readdirSync(folderPath);
        return files
            .filter((file) => {
                if (file.startsWith(".")) return false;
                const ext = path.extname(file).toLowerCase();
                return VALID_EXTS.has(ext);
            })
            .sort((a, b) =>
                a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: "base",
                }),
            )
            .map(
                (file) => `/images/${cleanFolder}/${encodeURIComponent(file)}`,
            );
    } catch (err) {
        console.error("Lỗi khi đọc thư mục ảnh:", folderPath, err);
        return [];
    }
}

/**
 * Quét toàn bộ các thư mục sản phẩm trong public/images/
 * để tìm các folder đang có ảnh
 */
export function scanImageFolders(): {
    category: string;
    folder: string;
    imageCount: number;
    sampleImages: string[];
    images: string[];
}[] {
    if (!fs.existsSync(IMAGES_DIR)) return [];

    const results: {
        category: string;
        folder: string;
        imageCount: number;
        sampleImages: string[];
        images: string[];
    }[] = [];

    try {
        const categories = fs.readdirSync(IMAGES_DIR);
        for (const cat of categories) {
            if (cat.startsWith(".")) continue;
            const catPath = path.join(IMAGES_DIR, cat);
            if (!fs.statSync(catPath).isDirectory()) continue;

            const subdirs = fs.readdirSync(catPath);
            for (const sub of subdirs) {
                if (sub.startsWith(".")) continue;
                const subPath = path.join(catPath, sub);
                if (!fs.statSync(subPath).isDirectory()) continue;

                const relFolder = `${cat}/${sub}`;
                const images = getImagesFromFolder(relFolder);
                results.push({
                    category: cat,
                    folder: relFolder,
                    imageCount: images.length,
                    sampleImages: images.slice(0, 3),
                    images,
                });
            }
        }
    } catch (err) {
        console.error("Lỗi khi quét thư mục public/images:", err);
    }

    return results;
}

/**
 * Đọc danh sách sản phẩm từ file JSON kèm ảnh thực tế đã quét
 */
export function getProductsServer(): Product[] {
    let list: Product[] = [];

    try {
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, "utf8");
            list = JSON.parse(content);
        } else {
            list = initialProducts as unknown as Product[];
        }
    } catch (err) {
        console.error("Lỗi đọc file products.json:", err);
        list = initialProducts as unknown as Product[];
    }

    // Tự động gán danh sách ảnh thực tế nếu sản phẩm có chỉ định imageFolder
    return list.map((p) => {
        let images: string[] = p.images ?? [];
        if (p.imageFolder) {
            const folderImages = getImagesFromFolder(p.imageFolder);
            if (folderImages.length > 0) {
                images = folderImages;
            }
        }
        return {
            ...p,
            images,
        };
    });
}

/**
 * Lấy chi tiết một sản phẩm theo slug
 */
export function getProductBySlugServer(slug: string): Product | undefined {
    const products = getProductsServer();
    return products.find((p) => p.slug === slug);
}

/**
 * Lưu danh sách sản phẩm vào file products.json
 */
export function saveProductsServer(products: Product[]): boolean {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf8");
        return true;
    } catch (err) {
        console.error("Lỗi khi lưu products.json:", err);
        return false;
    }
}

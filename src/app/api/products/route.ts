import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import {
    getProductsServer,
    scanImageFolders,
    saveProductsServer,
} from "@/lib/products-server";
import type { Product, CategoryId } from "@/lib/products";

const DATA_FILE = path.join(process.cwd(), "src/data/products.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function checkAuth(req: Request, body?: Record<string, unknown>): boolean {
    const headerPass = req.headers.get("x-admin-password");
    if (headerPass === ADMIN_PASSWORD) return true;
    if (body && body.adminPassword === ADMIN_PASSWORD) return true;
    return false;
}

export async function GET() {
    try {
        const products = getProductsServer();
        const folders = scanImageFolders();
        return NextResponse.json({
            success: true,
            products,
            folders,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 },
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        // Kiểm tra quyền quản trị bằng mật khẩu
        if (!checkAuth(req, body)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Mật khẩu quản trị không đúng hoặc đã hết hạn",
                },
                { status: 401 },
            );
        }

        const {
            id,
            slug,
            name,
            price,
            oldPrice,
            description,
            shortDesc,
            imageFolder,
            featured,
            category,
        } = body;

        const identifier = slug || id;
        if (!identifier) {
            return NextResponse.json(
                { success: false, error: "Thiếu mã sản phẩm" },
                { status: 400 },
            );
        }

        // Đọc danh sách gốc từ file
        let list: Product[] = [];
        if (fs.existsSync(DATA_FILE)) {
            list = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        } else {
            list = getProductsServer();
        }

        const index = list.findIndex(
            (p) =>
                (p.slug && p.slug === identifier) ||
                (p.id && p.id === identifier),
        );
        if (index === -1) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy sản phẩm" },
                { status: 404 },
            );
        }

        // Cập nhật các trường
        if (name !== undefined) list[index].name = name;
        if (price !== undefined) list[index].price = Number(price);

        // Xử lý giá niêm yết cũ (oldPrice) - nếu để trống hoặc null thì xoá bỏ hoàn toàn
        if ("oldPrice" in body) {
            const num = Number(body.oldPrice);
            if (
                body.oldPrice !== null &&
                body.oldPrice !== undefined &&
                body.oldPrice !== "" &&
                !isNaN(num) &&
                num > 0
            ) {
                list[index].oldPrice = num;
            } else {
                delete list[index].oldPrice;
            }
        }

        if (description !== undefined) list[index].description = description;
        if (shortDesc !== undefined) list[index].shortDesc = shortDesc;

        // Xử lý thư mục ảnh (imageFolder)
        if ("imageFolder" in body) {
            if (
                body.imageFolder &&
                typeof body.imageFolder === "string" &&
                body.imageFolder.trim() !== ""
            ) {
                list[index].imageFolder = body.imageFolder.trim();
            } else {
                delete list[index].imageFolder;
            }
        }

        if (category !== undefined)
            list[index].category = category as CategoryId;
        if (featured !== undefined) list[index].featured = Boolean(featured);

        const saved = saveProductsServer(list);
        if (!saved) {
            return NextResponse.json(
                { success: false, error: "Lỗi ghi file dữ liệu" },
                { status: 500 },
            );
        }

        // Revalidate các trang để phản ánh dữ liệu mới ngay lập tức
        try {
            revalidatePath("/");
            revalidatePath("/san-pham");
            revalidatePath(`/san-pham/${list[index].slug}`);
            revalidatePath("/quan-ly");
        } catch (e) {
            console.warn("Revalidate error (ignored in dev):", e);
        }

        return NextResponse.json({
            success: true,
            message: "Cập nhật sản phẩm thành công",
            product: list[index],
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Kiểm tra quyền quản trị bằng mật khẩu
        if (!checkAuth(req, body)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Mật khẩu quản trị không đúng hoặc đã hết hạn",
                },
                { status: 401 },
            );
        }

        const {
            name,
            price,
            oldPrice,
            description,
            shortDesc,
            imageFolder,
            category,
            featured,
        } = body;

        if (!name || !price) {
            return NextResponse.json(
                { success: false, error: "Tên và giá sản phẩm là bắt buộc" },
                { status: 400 },
            );
        }

        let list: Product[] = [];
        if (fs.existsSync(DATA_FILE)) {
            list = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        } else {
            list = getProductsServer();
        }

        const slug =
            name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "") +
            "-" +
            Date.now().toString().slice(-4);

        const parsedOldPrice =
            oldPrice && Number(oldPrice) > 0 ? Number(oldPrice) : undefined;

        const newProduct: Product = {
            id: `p-${Date.now()}`,
            slug,
            name,
            price: Number(price),
            ...(parsedOldPrice ? { oldPrice: parsedOldPrice } : {}),
            description: description || "",
            shortDesc: shortDesc || "",
            imageFolder:
                imageFolder && imageFolder.trim() !== ""
                    ? imageFolder.trim()
                    : undefined,
            category: (category as CategoryId) || "giuong-sat",
            type: "bunk",
            color: "#2a7065",
            specs: [
                {
                    label: "Chất liệu",
                    value: "Sắt thép Hoà Phát sơn tĩnh điện",
                },
            ],
            material: "Sắt sơn tĩnh điện",
            warranty: "Sắt thép Hoà Phát",
            inStock: true,
            featured: Boolean(featured),
        };

        list.unshift(newProduct);
        saveProductsServer(list);

        try {
            revalidatePath("/");
            revalidatePath("/san-pham");
            revalidatePath("/quan-ly");
        } catch {}

        return NextResponse.json({
            success: true,
            message: "Thêm sản phẩm thành công",
            product: newProduct,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 },
        );
    }
}

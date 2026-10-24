import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getImagesFromFolder, scanImageFolders } from "@/lib/products-server";

const IMAGES_DIR = path.join(process.cwd(), "public/images");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function sanitizeFileName(name: string): string {
    return name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_")
        .toLowerCase();
}

function getCategoryFolder(category?: string): string {
    if (!category) return "giuong";
    if (category.startsWith("giuong")) return "giuong";
    if (category.startsWith("tu")) return "tu";
    if (category.startsWith("ban")) return "ban";
    return "khac";
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Kiểm tra mật khẩu quản trị
        const password = formData.get("adminPassword") as string;
        const headerPass = req.headers.get("x-admin-password");
        if (password !== ADMIN_PASSWORD && headerPass !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { success: false, error: "Mật khẩu quản trị không đúng" },
                { status: 401 },
            );
        }

        const slug = (formData.get("slug") as string)?.trim();
        const category = formData.get("category") as string;
        const files = formData.getAll("files") as File[];

        if (!slug) {
            return NextResponse.json(
                { success: false, error: "Thiếu mã sản phẩm (slug)" },
                { status: 400 },
            );
        }

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, error: "Vui lòng chọn ít nhất một file ảnh" },
                { status: 400 },
            );
        }

        // Tự động xác định tên thư mục: ví dụ giuong/giuong-tang-sat-1m-1m-co-hoc
        const catFolder = getCategoryFolder(category);
        const productFolder = slug.replace(/[^a-zA-Z0-9-]/g, "");
        const relFolderPath = `${catFolder}/${productFolder}`;
        const targetDir = path.join(IMAGES_DIR, catFolder, productFolder);

        // Tự động tạo thư mục nếu chưa có
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Lưu từng file ảnh vào thư mục
        const savedFiles: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.name) continue;

            const buffer = Buffer.from(await file.arrayBuffer());
            const ext = path.extname(file.name) || ".jpg";
            const baseName = path.basename(file.name, ext);
            const safeName = `${Date.now()}_${i + 1}_${sanitizeFileName(baseName)}${ext}`;

            const filePath = path.join(targetDir, safeName);
            fs.writeFileSync(filePath, buffer);
            savedFiles.push(safeName);
        }

        // Lấy lại danh sách đầy đủ ảnh trong thư mục này
        const allImages = getImagesFromFolder(relFolderPath);

        return NextResponse.json({
            success: true,
            message: `Đã tự động tạo thư mục và tải lên ${savedFiles.length} ảnh thành công!`,
            imageFolder: relFolderPath,
            images: allImages,
            folders: scanImageFolders(),
        });
    } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 },
        );
    }
}

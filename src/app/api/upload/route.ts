import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
    getImagesFromFolder,
    getProductsServer,
    scanImageFolders,
} from "@/lib/products-server";

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

        const files = formData.getAll("files") as File[];
        const replacePath = (formData.get("replacePath") as string)?.trim();

        // Trường hợp cắt ảnh vuông và ghi đè trực tiếp vào file ảnh cũ
        if (replacePath && files.length > 0) {
            const cleanPath = replacePath
                .replace(/^\/?images\//, "")
                .replace(/^\//, "");
            const targetFile = path.resolve(path.join(IMAGES_DIR, cleanPath));
            if (!targetFile.startsWith(path.resolve(IMAGES_DIR))) {
                return NextResponse.json(
                    { success: false, error: "Đường dẫn ảnh không hợp lệ" },
                    { status: 400 },
                );
            }

            const buffer = Buffer.from(await files[0].arrayBuffer());
            fs.writeFileSync(targetFile, buffer);

            const relFolder = path.dirname(cleanPath);
            const allImages = getImagesFromFolder(relFolder);

            return NextResponse.json({
                success: true,
                message: "Đã cắt và lưu ảnh vuông thành công!",
                images: allImages,
                folders: scanImageFolders(),
                products: getProductsServer(),
            });
        }

        const slug = (formData.get("slug") as string)?.trim();
        const category = formData.get("category") as string;

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

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const headerPass = req.headers.get("x-admin-password");
        if (
            body.adminPassword !== ADMIN_PASSWORD &&
            headerPass !== ADMIN_PASSWORD
        ) {
            return NextResponse.json(
                { success: false, error: "Mật khẩu quản trị không đúng" },
                { status: 401 },
            );
        }

        const { folder, orderedImages } = body;
        if (!folder || !Array.isArray(orderedImages) || orderedImages.length === 0) {
            return NextResponse.json(
                { success: false, error: "Thiếu thông tin sắp xếp ảnh" },
                { status: 400 },
            );
        }

        const cleanFolder = folder.replace(/^\/?images\//, "").replace(/^\//, "");
        const fullFolderPath = path.resolve(path.join(IMAGES_DIR, cleanFolder));

        if (!fullFolderPath.startsWith(path.resolve(IMAGES_DIR))) {
            return NextResponse.json(
                { success: false, error: "Đường dẫn không hợp lệ" },
                { status: 400 },
            );
        }

        if (!fs.existsSync(fullFolderPath) || !fs.statSync(fullFolderPath).isDirectory()) {
            return NextResponse.json(
                { success: false, error: "Thư mục không tồn tại" },
                { status: 404 },
            );
        }

        // Đổi tên file theo thứ tự mới:
        // Bước 1: Gắn tiền tố tạm thời '__tmp_rand_' để tránh trùng lặp tên
        const tempMap: { tempPath: string; targetName: string }[] = [];
        const nonce = Date.now();

        orderedImages.forEach((imgUrl: string, idx: number) => {
            const fileName = decodeURIComponent(path.basename(imgUrl));
            const currentPath = path.join(fullFolderPath, fileName);

            if (fs.existsSync(currentPath)) {
                const ext = path.extname(fileName);
                // Loại bỏ tiền tố thứ tự cũ nếu có (ví dụ '001_', '1793192561481_1_')
                let cleanBase = path.basename(fileName, ext);
                cleanBase = cleanBase.replace(/^(\d{3}_|\d+_\d+_)/, "");

                // Tên đích mới: 001_cleanBase.ext, 002_cleanBase.ext...
                const orderPrefix = String(idx + 1).padStart(3, "0");
                const targetName = `${orderPrefix}_${cleanBase}${ext}`;

                const tempName = `__tmp_${nonce}_${idx}_${fileName}`;
                const tempPath = path.join(fullFolderPath, tempName);

                fs.renameSync(currentPath, tempPath);
                tempMap.push({ tempPath, targetName });
            }
        });

        // Bước 2: Đổi từ tên tạm sang tên chuẩn
        for (const item of tempMap) {
            const finalPath = path.join(fullFolderPath, item.targetName);
            fs.renameSync(item.tempPath, finalPath);
        }

        const updatedImages = getImagesFromFolder(cleanFolder);

        return NextResponse.json({
            success: true,
            message: "Đã cập nhật thứ tự hiển thị ảnh thành công!",
            images: updatedImages,
            folders: scanImageFolders(),
            products: getProductsServer(),
        });
    } catch (error) {
        console.error("Lỗi đổi thứ tự ảnh:", error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 },
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const headerPass = req.headers.get("x-admin-password");
        if (
            body.adminPassword !== ADMIN_PASSWORD &&
            headerPass !== ADMIN_PASSWORD
        ) {
            return NextResponse.json(
                { success: false, error: "Mật khẩu quản trị không đúng" },
                { status: 401 },
            );
        }

        const { imagePath, folderPath } = body;

        // Xoá 1 ảnh đơn lẻ
        if (imagePath) {
            const cleanPath = imagePath
                .replace(/^\/?images\//, "")
                .replace(/^\//, "");
            const fullPath = path.resolve(path.join(IMAGES_DIR, cleanPath));

            if (!fullPath.startsWith(path.resolve(IMAGES_DIR))) {
                return NextResponse.json(
                    { success: false, error: "Đường dẫn không hợp lệ" },
                    { status: 400 },
                );
            }

            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }

            return NextResponse.json({
                success: true,
                message: "Đã xoá ảnh thành công!",
                folders: scanImageFolders(),
                products: getProductsServer(),
            });
        }

        // Xoá toàn bộ ảnh trong 1 thư mục
        if (folderPath) {
            const cleanFolder = folderPath
                .replace(/^\/?images\//, "")
                .replace(/^\//, "");
            const fullFolderPath = path.resolve(
                path.join(IMAGES_DIR, cleanFolder),
            );

            if (!fullFolderPath.startsWith(path.resolve(IMAGES_DIR))) {
                return NextResponse.json(
                    { success: false, error: "Đường dẫn không hợp lệ" },
                    { status: 400 },
                );
            }

            if (
                fs.existsSync(fullFolderPath) &&
                fs.statSync(fullFolderPath).isDirectory()
            ) {
                const files = fs.readdirSync(fullFolderPath);
                for (const file of files) {
                    if (!file.startsWith(".")) {
                        fs.unlinkSync(path.join(fullFolderPath, file));
                    }
                }
            }

            return NextResponse.json({
                success: true,
                message: "Đã xoá toàn bộ ảnh trong thư mục!",
                folders: scanImageFolders(),
                products: getProductsServer(),
            });
        }

        return NextResponse.json(
            { success: false, error: "Thiếu thông tin ảnh cần xoá" },
            { status: 400 },
        );
    } catch (error) {
        console.error("Lỗi xoá ảnh:", error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 },
        );
    }
}

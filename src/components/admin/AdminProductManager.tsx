"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { categories, formatPrice } from "@/lib/products";
import { matchSearch as checkSearchMatch } from "@/lib/search";
import ProductImage from "@/components/ProductImage";
import {
    Search,
    Folder,
    Image as ImageIcon,
    Edit3,
    ExternalLink,
    Check,
    AlertCircle,
    X,
    RefreshCw,
    Plus,
    Sparkles,
    Layers,
    Save,
    Lock,
    KeyRound,
    Eye,
    EyeOff,
    LogOut,
    ShieldCheck,
    UploadCloud,
    Camera,
    ChevronDown,
    ChevronUp,
    Trash2,
    Crop,
    RotateCw,
    ZoomIn,
    ZoomOut,
    Move,
} from "lucide-react";

type FolderInfo = {
    category: string;
    folder: string;
    imageCount: number;
    sampleImages: string[];
    images?: string[];
};

type Props = {
    initialProducts: Product[];
    initialFolders: FolderInfo[];
};

export default function AdminProductManager({
    initialProducts,
    initialFolders,
}: Props) {
    // Quản lý trạng thái xác thực bảo vệ
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
    const [inputPassword, setInputPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string>("");

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [folders, setFolders] = useState<FolderInfo[]>(initialFolders);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [filterImageStatus, setFilterImageStatus] = useState<
        "all" | "has_real" | "no_real"
    >("all");

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [deletingImageSrc, setDeletingImageSrc] = useState<string | null>(
        null,
    );
    const [isDeletingAll, setIsDeletingAll] = useState<boolean>(false);
    const [isReordering, setIsReordering] = useState<boolean>(false);
    const [draggedImgIndex, setDraggedImgIndex] = useState<number | null>(null);
    const [dragOverImgIndex, setDragOverImgIndex] = useState<number | null>(null);
    const [showManualFolderSelect, setShowManualFolderSelect] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Trạng thái cắt ảnh vuông (Square Crop)
    const [croppingImageSrc, setCroppingImageSrc] = useState<string | null>(
        null,
    );
    const [isCropping, setIsCropping] = useState<boolean>(false);
    const [cropZoom, setCropZoom] = useState<number>(1);
    const [cropRotation, setCropRotation] = useState<number>(0);
    const [cropPan, setCropPan] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const panStartRef = useRef({ x: 0, y: 0 });
    const cropContainerRef = useRef<HTMLDivElement>(null);
    const cropImgRef = useRef<HTMLImageElement>(null);

    const openCropModal = (src: string) => {
        setCroppingImageSrc(src);
        setCropZoom(1);
        setCropRotation(0);
        setCropPan({ x: 0, y: 0 });
    };

    const closeCropModal = () => {
        setCroppingImageSrc(null);
        setIsCropping(false);
    };

    // Hàm tự động cắt ảnh vuông ở tâm ảnh khi chọn file
    const cropFileToSquareCenter = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            const objectUrl = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                const size = Math.min(img.naturalWidth, img.naturalHeight);
                const canvas = document.createElement("canvas");
                const targetDim = Math.min(size, 1600);
                canvas.width = targetDim;
                canvas.height = targetDim;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    resolve(file);
                    return;
                }
                const sx = (img.naturalWidth - size) / 2;
                const sy = (img.naturalHeight - size) / 2;
                ctx.drawImage(
                    img,
                    sx,
                    sy,
                    size,
                    size,
                    0,
                    0,
                    targetDim,
                    targetDim,
                );
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file);
                            return;
                        }
                        const croppedFile = new File([blob], file.name, {
                            type: file.type || "image/jpeg",
                            lastModified: Date.now(),
                        });
                        resolve(croppedFile);
                    },
                    file.type === "image/png" ? "image/png" : "image/jpeg",
                    0.92,
                );
            };
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(file);
            };
            img.src = objectUrl;
        });
    };

    // Hàm lưu ảnh cắt từ Crop Modal và ghi đè trực tiếp
    const handleSaveCroppedImage = async () => {
        if (
            !croppingImageSrc ||
            !cropContainerRef.current ||
            !cropImgRef.current
        )
            return;
        setIsCropping(true);

        try {
            const container = cropContainerRef.current;
            const img = cropImgRef.current;
            const containerRect = container.getBoundingClientRect();
            const containerSize = containerRect.width;

            const canvas = document.createElement("canvas");
            const outSize = 1200;
            canvas.width = outSize;
            canvas.height = outSize;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Không thể khởi tạo canvas");

            const scaleFactor = outSize / containerSize;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, outSize, outSize);

            ctx.save();
            ctx.translate(outSize / 2, outSize / 2);
            ctx.translate(cropPan.x * scaleFactor, cropPan.y * scaleFactor);
            ctx.rotate((cropRotation * Math.PI) / 180);
            ctx.scale(cropZoom, cropZoom);

            const imgAspect = img.naturalWidth / img.naturalHeight;
            let drawW = containerSize;
            let drawH = containerSize;
            if (imgAspect > 1) {
                drawW = containerSize * imgAspect;
                drawH = containerSize;
            } else {
                drawW = containerSize;
                drawH = containerSize / imgAspect;
            }

            const outDrawW = drawW * scaleFactor;
            const outDrawH = drawH * scaleFactor;

            ctx.drawImage(
                img,
                -outDrawW / 2,
                -outDrawH / 2,
                outDrawW,
                outDrawH,
            );
            ctx.restore();

            const blob = await new Promise<Blob | null>((res) =>
                canvas.toBlob(res, "image/jpeg", 0.92),
            );
            if (!blob) throw new Error("Lỗi trích xuất ảnh");

            const fileName = croppingImageSrc.split("/").pop() || "cropped.jpg";
            const croppedFile = new File([blob], fileName, {
                type: "image/jpeg",
            });

            const formData = new FormData();
            formData.append("adminPassword", "admin123");
            formData.append("replacePath", croppingImageSrc);
            formData.append("files", croppedFile);

            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "x-admin-password": "admin123",
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                showToast("Đã cắt và lưu ảnh vuông 1:1 thành công!");
                if (data.folders) setFolders(data.folders);
                if (data.products) setProducts(data.products);
                closeCropModal();
                handleRefreshFolders();
            } else {
                showToast("Lỗi lưu ảnh: " + data.error, "error");
            }
        } catch (err) {
            showToast("Lỗi khi cắt ảnh: " + (err as Error).message, "error");
        } finally {
            setIsCropping(false);
        }
    };

    const [toastMessage, setToastMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Form state
    const [formName, setFormName] = useState("");
    const [formPrice, setFormPrice] = useState<number>(0);
    const [formOldPrice, setFormOldPrice] = useState<number | undefined>(
        undefined,
    );
    const [formDescription, setFormDescription] = useState("");
    const [formShortDesc, setFormShortDesc] = useState("");
    const [formImageFolder, setFormImageFolder] = useState("");
    const [formCategory, setFormCategory] = useState("giuong-sat");
    const [formFeatured, setFormFeatured] = useState(false);

    // Ngăn chặn trình duyệt mở file khi kéo thả ra ngoài dropzone
    useEffect(() => {
        const preventDefaultDrop = (e: DragEvent) => {
            e.preventDefault();
        };
        window.addEventListener("dragover", preventDefaultDrop);
        window.addEventListener("drop", preventDefaultDrop);
        return () => {
            window.removeEventListener("dragover", preventDefaultDrop);
            window.removeEventListener("drop", preventDefaultDrop);
        };
    }, []);

    // Kiểm tra đăng nhập đã lưu trong sessionStorage
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem("admin_auth");
            if (saved === "admin123") {
                setIsAuthenticated(true);
            }
        } catch {}
        setIsCheckingAuth(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputPassword === "admin123") {
            try {
                sessionStorage.setItem("admin_auth", "admin123");
            } catch {}
            setIsAuthenticated(true);
            setAuthError("");
            showToast("Đăng nhập quản trị thành công!");
        } else {
            setAuthError("Mật khẩu không chính xác. Vui lòng thử lại!");
        }
    };

    const handleLogout = () => {
        try {
            sessionStorage.removeItem("admin_auth");
        } catch {}
        setIsAuthenticated(false);
        setInputPassword("");
        showToast("Đã đăng xuất khỏi trang quản lý!");
    };

    const showToast = (text: string, type: "success" | "error" = "success") => {
        setToastMessage({ text, type });
        setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };

    const handleRefreshFolders = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
                setFolders(data.folders);
                showToast("Đã quét lại toàn bộ thư mục và sản phẩm!");
            } else {
                showToast("Lỗi: " + data.error, "error");
            }
        } catch {
            showToast("Không thể kết nối máy chủ", "error");
        } finally {
            setIsRefreshing(false);
        }
    };

    const openEditModal = (p: Product) => {
        setIsCreatingNew(false);
        setEditingProduct(p);
        setFormName(p.name);
        setFormPrice(p.price);
        setFormOldPrice(p.oldPrice);
        setFormDescription(p.description || "");
        setFormShortDesc(p.shortDesc || "");
        setFormImageFolder(p.imageFolder || "");
        setFormCategory(p.category);
        setFormFeatured(Boolean(p.featured));
        setShowManualFolderSelect(false);
    };

    const openCreateModal = (defaultFolder?: string) => {
        setIsCreatingNew(true);
        setEditingProduct(null);
        const cat = defaultFolder ? defaultFolder.split("/")[0] : "giuong-sat";
        setFormName("");
        setFormPrice(2000000);
        setFormOldPrice(undefined);
        setFormDescription("");
        setFormShortDesc("");
        setFormImageFolder(defaultFolder || "");
        setFormCategory(cat === "giuong" ? "giuong-sat" : cat);
        setFormFeatured(false);
        setShowManualFolderSelect(false);
    };

    const closeModal = () => {
        setEditingProduct(null);
        setIsCreatingNew(false);
    };

    // Hàm tải ảnh trực tiếp, tự động tạo folder theo slug sản phẩm
    const handleUploadFiles = async (files: FileList | File[]) => {
        if (!files || files.length === 0) return;

        const validFiles = Array.from(files).filter(
            (file) =>
                file.type.startsWith("image/") ||
                /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name),
        );

        if (validFiles.length === 0) {
            showToast(
                "Vui lòng chọn hoặc kéo thả các file định dạng ảnh (JPG, PNG, WEBP)",
                "error",
            );
            return;
        }

        // Xác định slug để tạo folder
        const targetSlug =
            editingProduct?.slug ||
            formName
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

        if (!targetSlug) {
            showToast("Vui lòng nhập tên sản phẩm trước khi tải ảnh", "error");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("slug", targetSlug);
            formData.append("category", formCategory);
            formData.append("adminPassword", "admin123");
            validFiles.forEach((file) => formData.append("files", file));

            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "x-admin-password": "admin123",
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setFormImageFolder(data.imageFolder);
                if (data.folders) setFolders(data.folders);
                showToast(data.message || "Tải ảnh và tạo thư mục thành công!");
                // Tự động làm mới danh sách
                handleRefreshFolders();
            } else {
                showToast("Lỗi tải ảnh: " + data.error, "error");
            }
        } catch {
            showToast("Không thể tải ảnh lên máy chủ", "error");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeleteImage = async (src: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá ảnh này vĩnh viễn?")) {
            return;
        }

        setDeletingImageSrc(src);
        try {
            const res = await fetch("/api/upload", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": "admin123",
                },
                body: JSON.stringify({
                    imagePath: src,
                    adminPassword: "admin123",
                }),
            });

            const data = await res.json();
            if (data.success) {
                showToast("Đã xoá ảnh thành công!");
                if (data.folders) setFolders(data.folders);
                if (data.products) setProducts(data.products);
            } else {
                showToast("Lỗi xoá ảnh: " + data.error, "error");
            }
        } catch {
            showToast("Không thể kết nối máy chủ để xoá ảnh", "error");
        } finally {
            setDeletingImageSrc(null);
        }
    };

    const handleDeleteAllInFolder = async (folder: string) => {
        if (
            !window.confirm(
                `Bạn có chắc chắn muốn xoá TOÀN BỘ ảnh trong thư mục "${folder}"? Hành động này sẽ xoá file thật và không thể hoàn tác!`,
            )
        ) {
            return;
        }

        setIsDeletingAll(true);
        try {
            const res = await fetch("/api/upload", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": "admin123",
                },
                body: JSON.stringify({
                    folderPath: folder,
                    adminPassword: "admin123",
                }),
            });

            const data = await res.json();
            if (data.success) {
                showToast("Đã xoá toàn bộ ảnh trong thư mục!");
                if (data.folders) setFolders(data.folders);
                if (data.products) setProducts(data.products);
            } else {
                showToast("Lỗi xoá ảnh: " + data.error, "error");
            }
        } catch {
            showToast("Không thể kết nối máy chủ để xoá ảnh", "error");
        } finally {
            setIsDeletingAll(false);
        }
    };

    const handleReorderImages = async (
        folder: string,
        fromIndex: number,
        toIndex: number,
        currentImages: string[],
    ) => {
        if (fromIndex === toIndex || !folder) return;
        const newImages = [...currentImages];
        const [moved] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, moved);

        // Cập nhật state UI lạc quan ngay lập tức
        setFolders((prevFolders) =>
            prevFolders.map((f) =>
                f.folder === folder
                    ? { ...f, images: newImages, sampleImages: newImages.slice(0, 3) }
                    : f,
            ),
        );
        if (editingProduct && editingProduct.imageFolder === folder) {
            setEditingProduct({
                ...editingProduct,
                images: newImages,
            });
        }

        setIsReordering(true);
        try {
            const res = await fetch("/api/upload", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": "admin123",
                },
                body: JSON.stringify({
                    folder,
                    orderedImages: newImages,
                    adminPassword: "admin123",
                }),
            });

            const data = await res.json();
            if (data.success) {
                showToast("Đã cập nhật thứ tự ảnh!");
                if (data.folders) setFolders(data.folders);
                if (data.products) setProducts(data.products);
            } else {
                showToast("Lỗi sắp xếp: " + data.error, "error");
            }
        } catch {
            showToast("Không thể lưu thứ tự ảnh mới", "error");
        } finally {
            setIsReordering(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) {
            showToast("Vui lòng nhập tên sản phẩm", "error");
            return;
        }
        if (!formPrice || formPrice <= 0) {
            showToast("Vui lòng nhập giá hợp lệ", "error");
            return;
        }

        setIsSaving(true);
        try {
            const method = isCreatingNew ? "POST" : "PUT";
            const payload = isCreatingNew
                ? {
                      name: formName,
                      price: formPrice,
                      oldPrice:
                          formOldPrice && formOldPrice > 0
                              ? Number(formOldPrice)
                              : null,
                      description: formDescription,
                      shortDesc: formShortDesc,
                      imageFolder:
                          formImageFolder && formImageFolder.trim() !== ""
                              ? formImageFolder.trim()
                              : null,
                      category: formCategory,
                      featured: formFeatured,
                      adminPassword: "admin123",
                  }
                : {
                      slug: editingProduct?.slug,
                      id: editingProduct?.id,
                      name: formName,
                      price: formPrice,
                      oldPrice:
                          formOldPrice && formOldPrice > 0
                              ? Number(formOldPrice)
                              : null,
                      description: formDescription,
                      shortDesc: formShortDesc,
                      imageFolder:
                          formImageFolder && formImageFolder.trim() !== ""
                              ? formImageFolder.trim()
                              : null,
                      category: formCategory,
                      featured: formFeatured,
                      adminPassword: "admin123",
                  };

            const res = await fetch("/api/products", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": "admin123",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                showToast(
                    isCreatingNew
                        ? "Đã thêm sản phẩm mới thành công!"
                        : "Đã cập nhật thông tin sản phẩm!",
                );
                closeModal();
                // Refresh product list
                handleRefreshFolders();
            } else {
                showToast("Lỗi: " + data.error, "error");
            }
        } catch {
            showToast("Không thể gửi dữ liệu lên máy chủ", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // Khi đang nạp kiểm tra xác thực
    if (isCheckingAuth) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
            </div>
        );
    }

    // MÀN HÌNH NHẬP MẬT KHẨU BẢO VỆ ĐƯỜNG DẪN /quan-ly
    if (!isAuthenticated) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-4">
                <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                        <Lock className="h-7 w-7" />
                    </div>

                    <h1 className="mt-4 text-center text-xl font-black text-stone-900 sm:text-2xl">
                        Khu vực Quản trị Hệ thống
                    </h1>
                    <p className="mt-1 text-center text-xs text-stone-500">
                        Trang quản lý nội bộ. Vui lòng nhập mật khẩu quản trị để
                        tiếp tục.
                    </p>

                    <form onSubmit={handleLogin} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                                Mật khẩu quản trị
                            </label>
                            <div className="relative mt-1.5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                                    <KeyRound className="h-4 w-4" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoFocus
                                    value={inputPassword}
                                    onChange={(e) => {
                                        setInputPassword(e.target.value);
                                        if (authError) setAuthError("");
                                    }}
                                    placeholder="Nhập mật khẩu..."
                                    className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 pr-10 pl-10 text-sm font-medium text-stone-900 placeholder-stone-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-stone-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {authError && (
                                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-600 animate-shake">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {authError}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition active:scale-98 hover:bg-brand-700"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            Đăng nhập quản lý
                        </button>

                        <div className="pt-2 text-center">
                            <Link
                                href="/"
                                className="text-xs font-medium text-stone-400 transition hover:text-brand-600"
                            >
                                ← Quay lại Trang chủ website
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Preview images for selected folder in form
    const selectedFolderData = folders.find(
        (f) => f.folder === formImageFolder,
    );

    // Statistics
    const totalProducts = products.length;
    const productsWithRealImages = products.filter(
        (p) => p.images && p.images.length > 0,
    ).length;

    // Filtered products list
    const filteredProducts = products.filter((p) => {
        const matchSearch =
            searchTerm.trim() === "" ||
            checkSearchMatch(
                `${p.name} ${p.slug} ${p.shortDesc} ${p.imageFolder || ""}`,
                searchTerm,
            );

        const matchCat =
            selectedCategory === "all" || p.category === selectedCategory;

        const hasRealImages = p.images && p.images.length > 0;
        const matchImageStatus =
            filterImageStatus === "all" ||
            (filterImageStatus === "has_real" && hasRealImages) ||
            (filterImageStatus === "no_real" && !hasRealImages);

        return matchSearch && matchCat && matchImageStatus;
    });

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    className={`fixed right-6 bottom-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-xl backdrop-blur transition-all animate-bounce ${
                        toastMessage.type === "success"
                            ? "bg-emerald-600 shadow-emerald-600/30"
                            : "bg-rose-600 shadow-rose-600/30"
                    }`}
                >
                    {toastMessage.type === "success" ? (
                        <Check className="h-5 w-5" />
                    ) : (
                        <AlertCircle className="h-5 w-5" />
                    )}
                    <span>{toastMessage.text}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                        <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                        Hệ thống Quản trị Nội bộ
                    </div>
                    <h1 className="mt-2 text-2xl font-black text-stone-900 sm:text-3xl">
                        Quản lý Sản phẩm, Giá bán & Hình ảnh
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-stone-600">
                        Cập nhật tên thật, giá thật, mô tả sản phẩm và tự động
                        đồng bộ hóa hình ảnh từ các thư mục trong{" "}
                        <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-brand-700">
                            public/images/
                        </code>
                        .
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={handleRefreshFolders}
                        disabled={isRefreshing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-2xs transition active:scale-95 hover:bg-stone-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${isRefreshing ? "animate-spin text-brand-600" : ""}`}
                        />
                        {isRefreshing ? "Đang quét..." : "Quét lại folder"}
                    </button>
                    <button
                        onClick={() => openCreateModal()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-600/20 transition active:scale-95 hover:bg-brand-700"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm sản phẩm mới
                    </button>
                    <button
                        onClick={handleLogout}
                        title="Đăng xuất khỏi trang quản lý"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Stats overview */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3.5 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
                        <Layers className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-stone-500">
                            Tổng sản phẩm
                        </p>
                        <p className="text-xl font-black text-stone-900">
                            {totalProducts}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                        <ImageIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-stone-500">
                            Sản phẩm có ảnh thật
                        </p>
                        <p className="text-xl font-black text-stone-900">
                            {productsWithRealImages}{" "}
                            <span className="text-xs font-normal text-stone-400">
                                / {totalProducts}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                        <Folder className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-stone-500">
                            Thư mục ảnh đã quét
                        </p>
                        <p className="text-xl font-black text-stone-900">
                            {folders.length}{" "}
                            <span className="text-xs font-normal text-stone-400">
                                thư mục
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Thư mục ảnh đã tìm thấy trong public/images */}

            {/* Search and Filters */}
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2.5 pr-4 pl-10 text-sm text-stone-900 placeholder-stone-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Category filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus:border-brand-500 focus:outline-none"
                    >
                        <option value="all">Tất cả danh mục</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Real image status filter */}
                    <select
                        value={filterImageStatus}
                        onChange={(e) =>
                            setFilterImageStatus(
                                e.target.value as
                                    "all" | "has_real" | "no_real",
                            )
                        }
                        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus:border-brand-500 focus:outline-none"
                    >
                        <option value="all">Tất cả trạng thái ảnh</option>
                        <option value="has_real">Đã có ảnh thật (📷)</option>
                        <option value="no_real">Chưa có ảnh thật</option>
                    </select>
                </div>
            </div>

            {/* Products List Table / Grid */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-stone-200 bg-stone-50/70 text-xs font-bold uppercase tracking-wider text-stone-500">
                            <tr>
                                <th className="px-4 py-3.5">Ảnh</th>
                                <th className="px-4 py-3.5">Tên sản phẩm</th>
                                <th className="px-4 py-3.5">Giá bán</th>
                                <th className="px-4 py-3.5">
                                    Thư mục ảnh (Folder)
                                </th>
                                <th className="px-4 py-3.5 text-right">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-12 text-center text-stone-400"
                                    >
                                        Không tìm thấy sản phẩm nào phù hợp
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p) => {
                                    const hasReal =
                                        p.images && p.images.length > 0;
                                    const imgCount = p.images?.length || 0;

                                    return (
                                        <tr
                                            key={p.slug}
                                            className="group transition hover:bg-stone-50/80"
                                        >
                                            {/* Image Thumbnail */}
                                            <td className="px-4 py-3 align-middle">
                                                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                                                    {hasReal && p.images ? (
                                                        <Image
                                                            src={p.images[0]}
                                                            alt={p.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="64px"
                                                        />
                                                    ) : (
                                                        <ProductImage
                                                            type={p.type}
                                                            color={p.color}
                                                            showHint={false}
                                                            alt={p.name}
                                                            className="h-full w-full"
                                                        />
                                                    )}
                                                    {hasReal && (
                                                        <span className="absolute right-1 bottom-1 rounded-md bg-black/75 px-1 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                                            📷 {imgCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Name & details */}
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/san-pham/${p.slug}`}
                                                        target="_blank"
                                                        title="Xem trang sản phẩm"
                                                        className="font-bold text-stone-900 transition hover:text-brand-600 group-hover:text-brand-600"
                                                    >
                                                        {p.name}
                                                    </Link>
                                                    {p.featured && (
                                                        <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                                            Nổi bật
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 line-clamp-1 text-xs text-stone-500">
                                                    {p.shortDesc}
                                                </p>
                                                <p className="mt-0.5 font-mono text-[11px] text-stone-400">
                                                    slug: {p.slug}
                                                </p>
                                            </td>

                                            {/* Price */}
                                            <td className="whitespace-nowrap px-4 py-3 align-middle">
                                                <span className="font-black text-brand-700">
                                                    {formatPrice(p.price, true)}
                                                </span>
                                                {p.oldPrice && (
                                                    <p className="text-xs text-stone-400 line-through">
                                                        {formatPrice(
                                                            p.oldPrice,
                                                            true,
                                                        )}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Image Folder */}
                                            <td className="whitespace-nowrap px-4 py-3 align-middle">
                                                {p.imageFolder ? (
                                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs">
                                                        <Folder className="h-3.5 w-3.5 text-brand-600" />
                                                        <span className="font-mono text-stone-700">
                                                            {p.imageFolder}
                                                        </span>
                                                        <span className="font-bold text-emerald-600">
                                                            ({imgCount} ảnh)
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-stone-400">
                                                        Chưa có folder ảnh
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/san-pham/${p.slug}`}
                                                        target="_blank"
                                                        title="Xem trang sản phẩm"
                                                        className="grid h-8 w-8 place-items-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-stone-300 hover:text-stone-800"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(p)
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-600"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                        Sửa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT / CREATE MODAL */}
            {(editingProduct || isCreatingNew) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                {isCreatingNew ? (
                                    <Plus className="h-5 w-5" />
                                ) : (
                                    <Edit3 className="h-5 w-5" />
                                )}
                            </span>
                            <h2 className="text-xl font-black text-stone-900">
                                {isCreatingNew
                                    ? "Thêm sản phẩm mới"
                                    : `Sửa sản phẩm: ${editingProduct?.name}`}
                            </h2>
                        </div>

                        <form onSubmit={handleSave} className="mt-6 space-y-5">
                            {/* Tên sản phẩm */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                                    Tên sản phẩm{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) =>
                                        setFormName(e.target.value)
                                    }
                                    placeholder="Ví dụ: Giường sắt tầng không hộc 1m2 x 1m4"
                                    className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                                />
                            </div>

                            {/* Giá và Giá cũ */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                                        Giá bán thực tế (VNĐ){" "}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={100000}
                                        step={10000}
                                        value={formPrice}
                                        onChange={(e) =>
                                            setFormPrice(Number(e.target.value))
                                        }
                                        className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-semibold text-stone-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs font-bold text-brand-700">
                                        Hiển thị: {formatPrice(formPrice, true)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                                        Giá niêm yết cũ (gạch ngang)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={10000}
                                        value={formOldPrice || ""}
                                        onChange={(e) =>
                                            setFormOldPrice(
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : undefined,
                                            )
                                        }
                                        placeholder="Để trống nếu không giảm giá"
                                        className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                                    />
                                    {formOldPrice ? (
                                        <p className="mt-1 text-xs text-stone-500 line-through">
                                            Hiển thị:{" "}
                                            {formatPrice(formOldPrice, true)}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            {/* Danh mục */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                                    Danh mục sản phẩm
                                </label>
                                <select
                                    value={formCategory}
                                    onChange={(e) =>
                                        setFormCategory(e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                    \n{" "}
                                </select>
                            </div>

                            {/* TỰ ĐỘNG TẢI ẢNH LÊN & TỰ TẠO THƯ MỤC CHO SẢN PHẨM */}
                            <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 sm:p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
                                            <Camera className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-900">
                                                Hình ảnh thực tế của sản phẩm
                                            </label>
                                            <p className="text-[11px] text-stone-500">
                                                Tải ảnh trực tiếp, hệ thống sẽ
                                                tự tạo thư mục và gán ngay cho
                                                sản phẩm!
                                            </p>
                                        </div>
                                    </div>

                                    {formImageFolder && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormImageFolder("")
                                            }
                                            className="text-xs text-stone-500 hover:text-rose-600"
                                        >
                                            Xoá liên kết ảnh
                                        </button>
                                    )}
                                </div>

                                {/* Nút tải ảnh & khung kéo thả */}
                                <div className="mt-3.5">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                handleUploadFiles(
                                                    e.target.files,
                                                );
                                            }
                                        }}
                                        className="hidden"
                                        id="product-image-upload"
                                    />

                                    <label
                                        htmlFor="product-image-upload"
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsDraggingOver(true);
                                        }}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.dataTransfer.dropEffect = "copy";
                                            if (!isDraggingOver) {
                                                setIsDraggingOver(true);
                                            }
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (
                                                !e.currentTarget.contains(
                                                    e.relatedTarget as Node,
                                                )
                                            ) {
                                                setIsDraggingOver(false);
                                            }
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsDraggingOver(false);
                                            if (
                                                e.dataTransfer.files &&
                                                e.dataTransfer.files.length > 0
                                            ) {
                                                handleUploadFiles(
                                                    e.dataTransfer.files,
                                                );
                                            }
                                        }}
                                        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${
                                            isUploading
                                                ? "border-brand-400 bg-brand-100/50 opacity-70 cursor-not-allowed"
                                                : isDraggingOver
                                                ? "border-brand-600 bg-brand-50 shadow-md ring-4 ring-brand-200/70 scale-[1.01]"
                                                : "border-brand-300 bg-white hover:border-brand-500 hover:bg-brand-50/70"
                                        }`}
                                    >
                                        <div className="pointer-events-none grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 shadow-2xs">
                                            {isUploading ? (
                                                <RefreshCw className="h-6 w-6 animate-spin text-brand-600" />
                                            ) : (
                                                <UploadCloud
                                                    className={`h-6 w-6 transition ${
                                                        isDraggingOver
                                                            ? "scale-110 text-brand-700"
                                                            : ""
                                                    }`}
                                                />
                                            )}
                                        </div>
                                        <p className="pointer-events-none mt-2 text-xs font-bold text-stone-800">
                                            {isUploading
                                                ? "Đang lưu ảnh và tạo thư mục..."
                                                : isDraggingOver
                                                ? "Thả các file ảnh vào đây ngay..."
                                                : "Bấm để chọn nhiều ảnh hoặc kéo thả vào đây"}
                                        </p>
                                        <p className="pointer-events-none mt-0.5 text-[11px] text-stone-500">
                                            Hỗ trợ định dạng JPG, PNG, WEBP
                                            (chọn được nhiều ảnh cùng lúc)
                                        </p>
                                    </label>
                                </div>

                                {/* Hiển thị thư mục và các ảnh đã tải lên */}
                                {formImageFolder ? (
                                    <div className="mt-3.5 rounded-xl border border-brand-200 bg-white p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-800">
                                                <span>📁 Thư mục:</span>
                                                <span className="rounded bg-brand-50 px-2 py-0.5 text-brand-700">
                                                    {formImageFolder}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                                                    {selectedFolderData?.imageCount ||
                                                        0}{" "}
                                                    ảnh
                                                </span>
                                                {selectedFolderData &&
                                                    selectedFolderData.imageCount >
                                                        0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteAllInFolder(
                                                                    formImageFolder,
                                                                )
                                                            }
                                                            disabled={
                                                                isDeletingAll
                                                            }
                                                            className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 transition hover:text-rose-700 hover:underline disabled:opacity-50"
                                                        >
                                                            {isDeletingAll ? (
                                                                <RefreshCw className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-3 w-3" />
                                                            )}
                                                            Xoá tất cả ảnh
                                                        </button>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Danh sách ảnh xem trước với nút xoá từng ảnh */}
                                        {(() => {
                                            const currentFolderImages =
                                                (selectedFolderData?.images &&
                                                    selectedFolderData.images
                                                        .length > 0 &&
                                                    selectedFolderData.images) ||
                                                (editingProduct?.imageFolder ===
                                                    formImageFolder &&
                                                    editingProduct?.images &&
                                                    editingProduct.images
                                                        .length > 0 &&
                                                    editingProduct.images) ||
                                                selectedFolderData?.sampleImages ||
                                                [];
                                            if (
                                                currentFolderImages.length === 0
                                            ) {
                                                return (
                                                    <div className="py-3 text-center text-xs text-stone-400 italic">
                                                        Thư mục này chưa có file
                                                        ảnh nào. Hãy tải ảnh lên
                                                        ở trên!
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="mt-2.5">
                                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-[11px] text-stone-500">
                                                        <span>
                                                            Kéo thả ảnh để thay đổi thứ tự hiển thị (#{1} là ảnh bìa chính). Bấm 🗑️ để xoá:
                                                        </span>
                                                        {isReordering && (
                                                            <span className="inline-flex items-center gap-1 font-semibold text-brand-600">
                                                                <RefreshCw className="h-3 w-3 animate-spin" />
                                                                Đang lưu thứ tự...
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                                                        {currentFolderImages.map(
                                                            (src, i) => {
                                                                const isBeingDragged = draggedImgIndex === i;
                                                                const isOver = dragOverImgIndex === i;

                                                                return (
                                                                <div
                                                                    key={src}
                                                                    draggable
                                                                    onDragStart={(e) => {
                                                                        setDraggedImgIndex(i);
                                                                        e.dataTransfer.effectAllowed = "move";
                                                                        e.dataTransfer.setData("text/plain", String(i));
                                                                    }}
                                                                    onDragOver={(e) => {
                                                                        e.preventDefault();
                                                                        e.dataTransfer.dropEffect = "move";
                                                                        if (dragOverImgIndex !== i) {
                                                                            setDragOverImgIndex(i);
                                                                        }
                                                                    }}
                                                                    onDragLeave={() => {
                                                                        if (dragOverImgIndex === i) {
                                                                            setDragOverImgIndex(null);
                                                                        }
                                                                    }}
                                                                    onDrop={(e) => {
                                                                        e.preventDefault();
                                                                        setDragOverImgIndex(null);
                                                                        const fromIdx = draggedImgIndex;
                                                                        setDraggedImgIndex(null);
                                                                        if (fromIdx !== null && fromIdx !== i && formImageFolder) {
                                                                            handleReorderImages(
                                                                                formImageFolder,
                                                                                fromIdx,
                                                                                i,
                                                                                currentFolderImages,
                                                                            );
                                                                        }
                                                                    }}
                                                                    onDragEnd={() => {
                                                                        setDraggedImgIndex(null);
                                                                        setDragOverImgIndex(null);
                                                                    }}
                                                                    className={`group relative aspect-square overflow-hidden rounded-xl border bg-stone-100 shadow-2xs cursor-grab active:cursor-grabbing transition-all ${
                                                                        isBeingDragged
                                                                            ? "opacity-35 scale-95 border-brand-400"
                                                                            : isOver
                                                                            ? "border-brand-600 ring-2 ring-brand-400 scale-105 z-10"
                                                                            : "border-stone-200 hover:border-brand-300"
                                                                    }`}
                                                                >
                                                                    <Image
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt=""
                                                                        fill
                                                                        aria-hidden="true"
                                                                        className="object-cover blur-md scale-125 opacity-35 select-none pointer-events-none"
                                                                        sizes="48px"
                                                                    />
                                                                    <Image
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt={`Ảnh ${i + 1}`}
                                                                        fill
                                                                        className="object-contain transition group-hover:scale-105 pointer-events-none select-none"
                                                                        sizes="96px"
                                                                    />

                                                                    {/* Nút cắt chỉnh ảnh vuông 1:1 */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            openCropModal(
                                                                                src,
                                                                            );
                                                                        }}
                                                                        title="Cắt căn chỉnh ảnh vuông 1:1"
                                                                        className="absolute top-1 left-1 grid h-6 w-6 place-items-center rounded-full bg-brand-600/90 text-white shadow-md transition hover:bg-brand-700 hover:scale-110 active:scale-95 z-20"
                                                                    >
                                                                        <Crop className="h-3 w-3" />
                                                                    </button>

                                                                    {/* Nút xoá trên từng ảnh */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            handleDeleteImage(
                                                                                src,
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            deletingImageSrc ===
                                                                            src
                                                                        }
                                                                        title="Xoá ảnh này"
                                                                        className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-rose-600/90 text-white shadow-md transition hover:bg-rose-700 hover:scale-110 active:scale-95 disabled:opacity-50 z-20"
                                                                    >
                                                                        {deletingImageSrc ===
                                                                        src ? (
                                                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                                                        ) : (
                                                                            <Trash2 className="h-3 w-3" />
                                                                        )}
                                                                    </button>

                                                                    <span className={`absolute bottom-1 left-1 rounded px-1.5 py-0.2 text-[9px] font-bold text-white backdrop-blur z-20 ${
                                                                        i === 0 ? "bg-brand-600" : "bg-black/60"
                                                                    }`}>
                                                                        #{i + 1}
                                                                    </span>
                                                                </div>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="mt-2 text-center text-xs text-stone-400">
                                        Sản phẩm này chưa có ảnh thực tế
                                    </div>
                                )}

                                {/* Nút mở rộng chọn thư mục thủ công nếu cần */}
                                <div className="mt-3 border-t border-brand-200/60 pt-2 text-right">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowManualFolderSelect(
                                                !showManualFolderSelect,
                                            )
                                        }
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-900"
                                    >
                                        <span>
                                            Hoặc chọn từ thư mục có sẵn / tự
                                            nhập path
                                        </span>
                                        {showManualFolderSelect ? (
                                            <ChevronUp className="h-3.5 w-3.5" />
                                        ) : (
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        )}
                                    </button>

                                    {showManualFolderSelect && (
                                        <div className="mt-2 text-left">
                                            <select
                                                value={formImageFolder}
                                                onChange={(e) =>
                                                    setFormImageFolder(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:border-brand-500 focus:outline-none"
                                            >
                                                <option value="">
                                                    -- Chưa chọn thư mục ảnh --
                                                </option>
                                                {folders.map((f) => (
                                                    <option
                                                        key={f.folder}
                                                        value={f.folder}
                                                    >
                                                        {f.folder} (
                                                        {f.imageCount} ảnh)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mô tả ngắn */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                                    Mô tả ngắn (hiển thị trên thẻ sản phẩm)
                                </label>
                                <input
                                    type="text"
                                    value={formShortDesc}
                                    onChange={(e) =>
                                        setFormShortDesc(e.target.value)
                                    }
                                    placeholder="Ví dụ: Giường sắt tĩnh điện cao cấp, chắc chắn, chịu lực tốt"
                                    className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                                />
                            </div>

                            {/* Mô tả chi tiết (Description) */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                                    Mô tả chi tiết sản phẩm
                                </label>
                                <textarea
                                    rows={5}
                                    value={formDescription}
                                    onChange={(e) =>
                                        setFormDescription(e.target.value)
                                    }
                                    placeholder="Nhập thông tin chi tiết: kích thước thực tế, vật liệu sắt hộp Hoà Phát, độ dày thành ống, sơn tĩnh điện, phụ kiện kèm theo..."
                                    className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm leading-relaxed text-stone-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                                />
                            </div>

                            {/* Checkbox Featured */}
                            <div className="flex items-center gap-2.5 pt-1">
                                <input
                                    type="checkbox"
                                    id="featured-check"
                                    checked={formFeatured}
                                    onChange={(e) =>
                                        setFormFeatured(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                                />
                                <label
                                    htmlFor="featured-check"
                                    className="cursor-pointer text-sm font-semibold text-stone-800"
                                >
                                    Đánh dấu là Sản phẩm nổi bật (hiển thị ở đầu
                                    trang chủ)
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
                                >
                                    Huỷ bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving || isUploading}
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition active:scale-95 hover:bg-brand-700 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL CẮT ẢNH VUÔNG 1:1 THỦ CÔNG */}
            {croppingImageSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
                    <div className="relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                    <Crop className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-stone-900">
                                        Cắt căn chỉnh ảnh vuông 1:1
                                    </h3>
                                    <p className="text-[11px] text-stone-500">
                                        Kéo thả di chuyển, phóng to hoặc xoay để
                                        góc chụp ưng ý nhất
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeCropModal}
                                className="grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Viewport khung cắt vuông 1:1 */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                            <div
                                ref={cropContainerRef}
                                onMouseDown={(e) => {
                                    isDraggingRef.current = true;
                                    dragStartRef.current = {
                                        x: e.clientX,
                                        y: e.clientY,
                                    };
                                    panStartRef.current = { ...cropPan };
                                }}
                                onMouseMove={(e) => {
                                    if (!isDraggingRef.current) return;
                                    const dx =
                                        e.clientX - dragStartRef.current.x;
                                    const dy =
                                        e.clientY - dragStartRef.current.y;
                                    setCropPan({
                                        x: panStartRef.current.x + dx,
                                        y: panStartRef.current.y + dy,
                                    });
                                }}
                                onMouseUp={() => {
                                    isDraggingRef.current = false;
                                }}
                                onMouseLeave={() => {
                                    isDraggingRef.current = false;
                                }}
                                onTouchStart={(e) => {
                                    if (e.touches.length === 1) {
                                        isDraggingRef.current = true;
                                        dragStartRef.current = {
                                            x: e.touches[0].clientX,
                                            y: e.touches[0].clientY,
                                        };
                                        panStartRef.current = { ...cropPan };
                                    }
                                }}
                                onTouchMove={(e) => {
                                    if (
                                        !isDraggingRef.current ||
                                        e.touches.length !== 1
                                    )
                                        return;
                                    const dx =
                                        e.touches[0].clientX -
                                        dragStartRef.current.x;
                                    const dy =
                                        e.touches[0].clientY -
                                        dragStartRef.current.y;
                                    setCropPan({
                                        x: panStartRef.current.x + dx,
                                        y: panStartRef.current.y + dy,
                                    });
                                }}
                                onTouchEnd={() => {
                                    isDraggingRef.current = false;
                                }}
                                className="relative aspect-square w-full max-w-[340px] sm:max-w-[380px] mx-auto overflow-hidden rounded-2xl bg-stone-950 border-2 border-brand-500 shadow-xl cursor-grab active:cursor-grabbing select-none"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={cropImgRef}
                                    src={croppingImageSrc}
                                    alt="Ảnh đang cắt"
                                    crossOrigin="anonymous"
                                    draggable={false}
                                    style={{
                                        transform: `translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropZoom}) rotate(${cropRotation}deg)`,
                                        transformOrigin: "center center",
                                        transition: isDraggingRef.current
                                            ? "none"
                                            : "transform 0.08s ease-out",
                                    }}
                                    className="absolute inset-0 m-auto h-full w-full object-contain pointer-events-none"
                                />

                                {/* Lưới 3x3 hỗ trợ căn bố cục */}
                                <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                                    <div className="border-r border-b border-white/25" />
                                    <div className="border-r border-b border-white/25" />
                                    <div className="border-b border-white/25" />
                                    <div className="border-r border-b border-white/25" />
                                    <div className="border-r border-b border-white/25" />
                                    <div className="border-b border-white/25" />
                                    <div className="border-r border-b border-white/25" />
                                    <div className="border-r border-b border-white/25" />
                                    <div />
                                </div>

                                {/* Badge tỉ lệ 1:1 */}
                                <div className="pointer-events-none absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                    Vuông 1:1
                                </div>
                            </div>

                            {/* Thanh công cụ điều khiển Zoom & Xoay */}
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <ZoomOut className="h-4 w-4 text-stone-400 shrink-0" />
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.05"
                                        value={cropZoom}
                                        onChange={(e) =>
                                            setCropZoom(
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-brand-600"
                                    />
                                    <ZoomIn className="h-4 w-4 text-stone-600 shrink-0" />
                                    <span className="w-10 text-right text-xs font-mono font-bold text-stone-700">
                                        {Math.round(cropZoom * 100)}%
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCropRotation(
                                                    (r) => (r + 90) % 360,
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 font-semibold text-stone-700 hover:bg-stone-100 active:scale-95 transition"
                                        >
                                            <RotateCw className="h-3.5 w-3.5" />
                                            Xoay 90°
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCropZoom(1);
                                                setCropRotation(0);
                                                setCropPan({ x: 0, y: 0 });
                                            }}
                                            className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 font-semibold text-stone-600 hover:bg-stone-100 active:scale-95 transition"
                                        >
                                            Đặt lại
                                        </button>
                                    </div>
                                    <span className="text-[11px] text-stone-400">
                                        Chuẩn 1200x1200px
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-end gap-2.5 border-t border-stone-100 bg-stone-50/60 px-5 py-3.5">
                            <button
                                type="button"
                                onClick={closeCropModal}
                                disabled={isCropping}
                                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 transition"
                            >
                                Huỷ
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveCroppedImage}
                                disabled={isCropping}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-600/20 hover:bg-brand-700 active:scale-95 transition disabled:opacity-50"
                            >
                                {isCropping ? (
                                    <>
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                        <span>Đang cắt & lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-3.5 w-3.5" />
                                        <span>Cắt & Lưu ảnh vuông</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

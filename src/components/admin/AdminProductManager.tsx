"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { categories, formatPrice } from "@/lib/products";
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
} from "lucide-react";

type FolderInfo = {
    category: string;
    folder: string;
    imageCount: number;
    sampleImages: string[];
};

type Props = {
    initialProducts: Product[];
    initialFolders: FolderInfo[];
};

export default function AdminProductManager({
    initialProducts,
    initialFolders,
}: Props) {
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
    };

    const closeModal = () => {
        setEditingProduct(null);
        setIsCreatingNew(false);
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
                      oldPrice: formOldPrice || undefined,
                      description: formDescription,
                      shortDesc: formShortDesc,
                      imageFolder: formImageFolder || undefined,
                      category: formCategory,
                      featured: formFeatured,
                  }
                : {
                      slug: editingProduct?.slug,
                      id: editingProduct?.id,
                      name: formName,
                      price: formPrice,
                      oldPrice: formOldPrice || undefined,
                      description: formDescription,
                      shortDesc: formShortDesc,
                      imageFolder: formImageFolder || undefined,
                      category: formCategory,
                      featured: formFeatured,
                  };

            const res = await fetch("/api/products", {
                method,
                headers: { "Content-Type": "application/json" },
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
            searchTerm === "" ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.slug.toLowerCase().includes(searchTerm.toLowerCase());

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
                    className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-xl backdrop-blur transition-all animate-bounce ${
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-stone-200 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                        <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                        Hệ thống Quản lý Dữ liệu Thực tế
                    </div>
                    <h1 className="mt-2 text-2xl font-black text-stone-900 sm:text-3xl">
                        Quản lý Sản phẩm, Giá bán & Hình ảnh
                    </h1>
                    <p className="mt-1 text-sm text-stone-600 max-w-2xl">
                        Cập nhật tên thật, giá thật, mô tả sản phẩm và tự động
                        đồng bộ hóa hình ảnh từ các thư mục trong{" "}
                        <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs font-mono text-brand-700">
                            public/images/
                        </code>
                        .
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={handleRefreshFolders}
                        disabled={isRefreshing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-2xs transition hover:bg-stone-50 active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${isRefreshing ? "animate-spin text-brand-600" : ""}`}
                        />
                        {isRefreshing ? "Đang quét..." : "Quét lại folder"}
                    </button>
                    <button
                        onClick={() => openCreateModal()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm sản phẩm mới
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
            <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/50 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Folder className="h-4.5 w-4.5 text-brand-600" />
                        <h2 className="text-sm font-bold text-stone-900">
                            Các thư mục ảnh thực tế tìm thấy trong{" "}
                            <code className="text-xs font-mono text-brand-700">
                                public/images/
                            </code>
                        </h2>
                    </div>
                    <span className="text-xs font-medium text-stone-500">
                        {folders.length} thư mục có sẵn
                    </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {folders.map((f) => {
                        const linkedProduct = products.find(
                            (p) => p.imageFolder === f.folder,
                        );
                        return (
                            <div
                                key={f.folder}
                                className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-3 shadow-2xs hover:border-brand-300 transition"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-mono font-medium text-stone-700">
                                            📂 {f.folder}
                                        </span>
                                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                                            {f.imageCount} ảnh
                                        </span>
                                    </div>

                                    {/* Sample images thumbnails */}
                                    {f.sampleImages.length > 0 && (
                                        <div className="mt-2.5 flex items-center gap-1.5 overflow-hidden rounded-lg bg-stone-50 p-1">
                                            {f.sampleImages.map((src, i) => (
                                                <div
                                                    key={i}
                                                    className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-stone-200"
                                                >
                                                    <Image
                                                        src={src}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {linkedProduct ? (
                                        <p className="mt-2 text-xs text-stone-600">
                                            Đã gắn vào:{" "}
                                            <span className="font-semibold text-brand-700">
                                                {linkedProduct.name}
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="mt-2 text-xs font-medium text-amber-600">
                                            ⚠️ Chưa gắn vào sản phẩm nào
                                        </p>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center justify-end gap-2 border-t border-stone-100 pt-2">
                                    {linkedProduct ? (
                                        <button
                                            onClick={() =>
                                                openEditModal(linkedProduct)
                                            }
                                            className="text-xs font-bold text-brand-600 hover:text-brand-700"
                                        >
                                            Sửa sản phẩm này →
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                openCreateModal(f.folder)
                                            }
                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                                        >
                                            + Tạo sản phẩm từ folder này
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
                                            className="transition hover:bg-stone-50/80 group"
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
                                                        <span className="absolute bottom-1 right-1 rounded-md bg-black/75 px-1 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                                            📷 {imgCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Name & details */}
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-stone-900 group-hover:text-brand-600 transition">
                                                        {p.name}
                                                    </p>
                                                    {p.featured && (
                                                        <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                                            Nổi bật
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">
                                                    {p.shortDesc}
                                                </p>
                                                <p className="mt-0.5 text-[11px] font-mono text-stone-400">
                                                    slug: {p.slug}
                                                </p>
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-3 align-middle whitespace-nowrap">
                                                <span className="font-black text-brand-700">
                                                    {formatPrice(p.price)}
                                                </span>
                                                {p.oldPrice && (
                                                    <p className="text-xs text-stone-400 line-through">
                                                        {formatPrice(
                                                            p.oldPrice,
                                                        )}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Image Folder */}
                                            <td className="px-4 py-3 align-middle whitespace-nowrap">
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
                                            <td className="px-4 py-3 align-middle text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/san-pham/${p.slug}`}
                                                        target="_blank"
                                                        title="Xem trang sản phẩm"
                                                        className="grid h-8 w-8 place-items-center rounded-lg border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-800 transition"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(p)
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-brand-600 transition"
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
                            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition"
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
                                    className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
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
                                        className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold"
                                    />
                                    <p className="mt-1 text-xs font-bold text-brand-700">
                                        Hiển thị: {formatPrice(formPrice)}
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
                                        className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                                    />
                                    {formOldPrice ? (
                                        <p className="mt-1 text-xs text-stone-500 line-through">
                                            Hiển thị:{" "}
                                            {formatPrice(formOldPrice)}
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
                                    className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Thư mục ảnh (imageFolder) */}
                            <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-900">
                                        📁 Chọn Thư mục Ảnh thực tế trong{" "}
                                        <span className="font-mono text-brand-700">
                                            public/images/
                                        </span>
                                    </label>
                                    {formImageFolder && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormImageFolder("")
                                            }
                                            className="text-xs text-stone-500 hover:text-rose-600"
                                        >
                                            Xoá chọn
                                        </button>
                                    )}
                                </div>

                                <select
                                    value={formImageFolder}
                                    onChange={(e) =>
                                        setFormImageFolder(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-mono text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                                >
                                    <option value="">
                                        -- Chưa chọn thư mục ảnh --
                                    </option>
                                    {folders.map((f) => (
                                        <option key={f.folder} value={f.folder}>
                                            {f.folder} ({f.imageCount} ảnh)
                                        </option>
                                    ))}
                                </select>

                                <p className="mt-1.5 text-xs text-stone-500">
                                    Hoặc bạn có thể tự nhập relative path (ví
                                    dụ:{" "}
                                    <code className="rounded bg-white px-1">
                                        giuong/giuongdonm4
                                    </code>
                                    ). Tất cả ảnh trong thư mục này sẽ tự động
                                    hiện lên slider ảnh của sản phẩm!
                                </p>

                                {/* Live Preview of photos in selected folder */}
                                {selectedFolderData &&
                                    selectedFolderData.sampleImages.length >
                                        0 && (
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold text-stone-700">
                                                Xem trước{" "}
                                                {selectedFolderData.imageCount}{" "}
                                                ảnh trong folder này:
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedFolderData.sampleImages.map(
                                                    (src, i) => (
                                                        <div
                                                            key={i}
                                                            className="relative h-16 w-16 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs"
                                                        >
                                                            <Image
                                                                src={src}
                                                                alt=""
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
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
                                    className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
                                    className="mt-1.5 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 leading-relaxed"
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
                                    className="text-sm font-semibold text-stone-800 cursor-pointer"
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
                                    className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-50 transition"
                                >
                                    Huỷ bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 active:scale-95 transition disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

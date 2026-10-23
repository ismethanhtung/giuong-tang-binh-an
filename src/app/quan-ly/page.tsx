import { getProductsServer, scanImageFolders } from "@/lib/products-server";
import AdminProductManager from "@/components/admin/AdminProductManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý sản phẩm & Hình ảnh thực tế",
  description: "Trang quản trị cập nhật tên thật, giá thật, mô tả và liên kết thư mục ảnh sản phẩm.",
};

export default function QuanLyPage() {
  const initialProducts = getProductsServer();
  const initialFolders = scanImageFolders();

  return (
    <div className="min-h-screen bg-stone-50/60 pb-16">
      <AdminProductManager
        initialProducts={initialProducts}
        initialFolders={initialFolders}
      />
    </div>
  );
}

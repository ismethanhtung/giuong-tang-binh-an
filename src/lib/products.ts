export type CategoryId =
  | "giuong-sat"
  | "giuong-go"
  | "tu-go"
  | "ban-ghe"
  | "khac";

export type ProductType = "bunk" | "bed" | "wardrobe" | "table" | "chair";

export type Category = {
  id: CategoryId;
  name: string;
  short: string;
  emoji: string;
  icon: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  type: ProductType;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  featured?: boolean;
  shortDesc: string;
  color: string;
  specs: { label: string; value: string }[];
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
    name: "Bàn ghế ăn",
    short: "Bàn ghế",
    emoji: "🍽️",
    icon: "/icons/ban-ghe.gif",
  },
  {
    id: "khac",
    name: "Nội thất khác",
    short: "Khác",
    emoji: "🛋️",
    icon: "/icons/khac.gif",
  },
];

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id);
}

export const products: Product[] = [
  {
    slug: "giuong-tang-sat-1m2-1m8",
    name: "Giường tầng sắt 1m2 – 1m8",
    category: "giuong-sat",
    type: "bunk",
    price: 3450000,
    oldPrice: 4200000,
    rating: 4.9,
    reviews: 128,
    badge: "Bán chạy",
    featured: true,
    shortDesc: "Khung sắt hộp 5x5 sơn tĩnh điện, hai tầng rộng rãi, chịu lực tốt.",
    color: "#3bb39a",
    specs: [
      { label: "Kích thước", value: "Dài 2m x Rộng 1,2m (tầng dưới 1,8m)" },
      { label: "Chất liệu", value: "Sắt hộp 5x5, sơn tĩnh điện" },
      { label: "Tải trọng", value: "~200kg/tầng" },
      { label: "Sắt thép", value: "Sắt thép Hoà Phát" },
    ],
  },
  {
    slug: "giuong-tang-sat-cau-thang",
    name: "Giường tầng sắt có cầu thang",
    category: "giuong-sat",
    type: "bunk",
    price: 4150000,
    rating: 4.8,
    reviews: 74,
    badge: "Có cầu thang",
    featured: true,
    shortDesc: "Cầu thang vững chắc, có tay vịn an toàn, phù hợp phòng trẻ.",
    color: "#38a3a5",
    specs: [
      { label: "Kích thước", value: "Dài 2m x Rộng 1,2m" },
      { label: "Chất liệu", value: "Sắt hộp + cầu thang an toàn" },
      { label: "Tải trọng", value: "~200kg/tầng" },
      { label: "Sắt thép", value: "Sắt thép Hoà Phát" },
    ],
  },
  {
    slug: "giuong-sat-don-1m2",
    name: "Giường sắt đơn 1m2",
    category: "giuong-sat",
    type: "bed",
    price: 1750000,
    rating: 4.7,
    reviews: 56,
    shortDesc: "Gọn nhẹ, tiết kiệm diện tích, phù hợp phòng trọ.",
    color: "#57cc99",
    specs: [
      { label: "Kích thước", value: "Dài 2m x Rộng 1,2m" },
      { label: "Chất liệu", value: "Sắt hộp sơn tĩnh điện" },
      { label: "Tải trọng", value: "~150kg" },
      { label: "Sắt thép", value: "Sắt thép Hoà Phát" },
    ],
  },
  {
    slug: "giuong-tang-sat-nguoi-lon-1m8",
    name: "Giường tầng sắt người lớn 1m8",
    category: "giuong-sat",
    type: "bunk",
    price: 5250000,
    oldPrice: 6100000,
    rating: 4.9,
    reviews: 41,
    shortDesc: "Bản rộng cho người lớn, khung dày chắc chắn, không rung lắc.",
    color: "#2a9d8f",
    featured: true,
    specs: [
      { label: "Kích thước", value: "Dài 2m x Rộng 1,8m" },
      { label: "Chất liệu", value: "Sắt hộp 6x6 cao cấp" },
      { label: "Tải trọng", value: "~250kg/tầng" },
      { label: "Sắt thép", value: "Sắt thép Hoà Phát" },
    ],
  },
  {
    slug: "giuong-go-cong-nghiep-1m6",
    name: "Giường gỗ công nghiệp 1m6",
    category: "giuong-go",
    type: "bed",
    price: 4900000,
    oldPrice: 5600000,
    rating: 4.8,
    reviews: 63,
    badge: "Giảm giá",
    shortDesc: "Gỗ MDF phủ melamine, màu vân gỗ tự nhiên, bo góc an toàn.",
    color: "#9a6a3c",
    specs: [
      { label: "Kích thước", value: "Dài 2m x Rộng 1,6m" },
      { label: "Chất liệu", value: "Gỗ MDF phủ melamine" },
      { label: "Màu sắc", value: "Vân gỗ / trắng" },
      { label: "Tiêu chuẩn", value: "Gỗ xuất khẩu chống ẩm" },
    ],
  },
  {
    slug: "giuong-go-tu-nhien-cam-lai",
    name: "Giường gỗ tự nhiên (căm xe)",
    category: "giuong-go",
    type: "bed",
    price: 12500000,
    rating: 5,
    reviews: 22,
    badge: "Cao cấp",
    shortDesc: "Gỗ tự nhiên 100%, chắc bền theo thời gian, đường nét tinh xảo.",
    color: "#7a4a24",
    specs: [
      { label: "Kích thước", value: "Dài 2m x Rộng 1,8m" },
      { label: "Chất liệu", value: "Gỗ căm xe tự nhiên" },
      { label: "Tiêu chuẩn", value: "Gỗ căm xe 100% tuyển chọn" },
    ],
  },
  {
    slug: "giuong-tang-go-cho-be",
    name: "Giường tầng gỗ cho bé",
    category: "giuong-go",
    type: "bunk",
    price: 6200000,
    rating: 4.8,
    reviews: 35,
    shortDesc: "Thiết kế dễ thương, an toàn cho bé, kèm lan can chắc chắn.",
    color: "#c98a52",
    specs: [
      { label: "Kích thước", value: "Dài 1,9m x Rộng 1,2m" },
      { label: "Chất liệu", value: "Gỗ cao su / MDF" },
      { label: "Phù hợp", value: "Bé 4 – 12 tuổi" },
    ],
  },
  {
    slug: "tu-quan-ao-3-canh",
    name: "Tủ quần áo 3 cánh gỗ",
    category: "tu-go",
    type: "wardrobe",
    price: 5900000,
    oldPrice: 6800000,
    rating: 4.7,
    reviews: 48,
    featured: true,
    shortDesc: "3 cánh mở, nhiều ngăn treo và kệ, phù hợp phòng ngủ.",
    color: "#8b6f52",
    specs: [
      { label: "Kích thước", value: "Cao 2m x Ngang 1,6m x Sâu 0,5m" },
      { label: "Chất liệu", value: "Gỗ MDF phủ melamine" },
      { label: "Tiêu chuẩn", value: "Ván MDF chống ẩm" },
    ],
  },
  {
    slug: "tu-dau-giuong-go",
    name: "Tủ đầu giường gỗ",
    category: "tu-go",
    type: "wardrobe",
    price: 1250000,
    rating: 4.6,
    reviews: 31,
    shortDesc: "Nhỏ gọn, 2 ngăn kéo, phối cùng giường gỗ rất hài hoà.",
    color: "#a9855c",
    specs: [
      { label: "Kích thước", value: "Cao 0,5m x Ngang 0,45m" },
      { label: "Chất liệu", value: "Gỗ cao su" },
    ],
  },
  {
    slug: "ban-an-go-6-ghe",
    name: "Bộ bàn ăn gỗ 6 ghế",
    category: "ban-ghe",
    type: "table",
    price: 8900000,
    oldPrice: 10200000,
    rating: 4.9,
    reviews: 57,
    badge: "Combo",
    featured: true,
    shortDesc: "Bàn ăn mặt gỗ kèm 6 ghế, khung chắc chắn, phù hợp gia đình.",
    color: "#96652f",
    specs: [
      { label: "Kích thước", value: "Bàn 1,6m x 0,8m" },
      { label: "Bộ gồm", value: "1 bàn + 6 ghế" },
      { label: "Chất liệu", value: "Gỗ cao su" },
    ],
  },
  {
    slug: "ban-tra-go-4-ghe",
    name: "Bàn trà gỗ 4 ghế",
    category: "ban-ghe",
    type: "table",
    price: 4200000,
    rating: 4.6,
    reviews: 26,
    shortDesc: "Set bàn trà ấm cúng cho phòng khách nhỏ.",
    color: "#b08442",
    specs: [
      { label: "Kích thước", value: "Bàn 1,2m x 0,6m" },
      { label: "Bộ gồm", value: "1 bàn + 4 ghế" },
    ],
  },
  {
    slug: "ghe-go-don",
    name: "Ghế gỗ đơn",
    category: "khac",
    type: "chair",
    price: 650000,
    rating: 4.5,
    reviews: 19,
    shortDesc: "Ghế gỗ chắc chắn, dùng cho bàn ăn hoặc bàn làm việc.",
    color: "#8f7a5c",
    specs: [
      { label: "Chất liệu", value: "Gỗ cao su" },
      { label: "Tải trọng", value: "~120kg" },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(vnd: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(vnd);
}

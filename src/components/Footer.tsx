import Link from "next/link";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import { PhoneIcon, ShieldIcon, TruckIcon, WrenchIcon } from "./icons";

const perks = [
  { icon: TruckIcon, title: "Miễn phí giao nội thành", desc: "Hỗ trợ toàn quốc" },
  { icon: ShieldIcon, title: "Bảo hành tới 36 tháng", desc: "Đổi mới nếu lỗi" },
  { icon: WrenchIcon, title: "Lắp đặt tận nhà", desc: "Nhanh, gọn, miễn phí" },
];

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        {perks.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-5.5 w-5.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-800">{title}</p>
              <p className="text-sm text-stone-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-2 text-base font-bold text-stone-900">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
                🛏️
              </span>
              {site.name}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-500">
              {site.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-800">Danh mục</p>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/san-pham?danh-muc=${c.id}`}
                    className="hover:text-brand-600"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-800">Liên hệ</p>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-brand-600" />
                <a href={site.phoneHref} className="font-medium">
                  {site.phone}
                </a>
              </li>
              <li>{site.address}</li>
              <li>{site.hours}</li>
              <li>
                <a
                  href={site.zalo}
                  className="mt-1 inline-flex rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Chat Zalo
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-100 py-5 text-center text-xs text-stone-400">
        © 2026 {site.name}. Ảnh trong trang là ảnh minh hoạ.
      </div>
    </footer>
  );
}

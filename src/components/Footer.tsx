import Link from "next/link";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import Logo from "./Logo";
import VietnamFlag from "./VietnamFlag";
import {
  ClockIcon,
  FacebookIcon,
  MapPinIcon,
  MessengerIcon,
  PhoneIcon,
  ShieldIcon,
  TruckIcon,
  WrenchIcon,
  ZaloIcon,
} from "./icons";

const perks = [
  { icon: TruckIcon, title: "Miễn phí giao nội thành", desc: "Hỗ trợ toàn quốc" },
  { icon: ShieldIcon, title: "Sắt thép Hoà Phát", desc: "Chính hãng, bền đẹp" },
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
          {/* Cột 1: Thông tin thương hiệu + 3 nút kết nối Zalo, Messenger, Facebook trên 1 hàng */}
          <div>
            <p className="flex items-center gap-2 text-base font-bold text-stone-900">
              <Logo className="h-9 w-9" />
              <span>{site.name}</span>
              <VietnamFlag className="h-4.5 w-4.5" />
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-500">
              {site.description}
            </p>
            <div className="mt-4 grid max-w-xs grid-cols-3 gap-1.5 sm:gap-2">
              <a
                href={site.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-sky-200/80 bg-sky-50/70 px-1.5 text-[11.5px] font-semibold text-sky-900 shadow-2xs transition hover:bg-sky-100 hover:border-sky-300 active:scale-95"
              >
                <ZaloIcon className="h-3.5 w-3.5 shrink-0" />
                <span>Zalo</span>
              </a>
              <a
                href={site.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-blue-200/80 bg-blue-50/70 px-1.5 text-[11.5px] font-semibold text-blue-900 shadow-2xs transition hover:bg-blue-100 hover:border-blue-300 active:scale-95"
              >
                <MessengerIcon className="h-3.5 w-3.5 shrink-0 text-[#0084FF]" />
                <span>Messenger</span>
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-indigo-200/80 bg-indigo-50/70 px-1.5 text-[11.5px] font-semibold text-indigo-900 shadow-2xs transition hover:bg-indigo-100 hover:border-indigo-300 active:scale-95"
              >
                <FacebookIcon className="h-3.5 w-3.5 shrink-0 text-[#1877F2]" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Cột 2: Danh mục */}
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

          {/* Cột 3: Liên hệ & Địa chỉ */}
          <div>
            <p className="text-sm font-semibold text-stone-800">Liên hệ & Địa chỉ</p>
            <ul className="mt-3 space-y-2.5 text-sm text-stone-600">
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="h-4.5 w-4.5 shrink-0 text-brand-600" />
                <a href={site.phoneHref} className="font-semibold text-stone-900 hover:text-brand-600">
                  {site.phone}
                </a>
                <span className="text-xs text-stone-400">(Hotline / Zalo)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
                <div>
                  <span className="font-semibold text-stone-800">Địa chỉ mới:</span>{" "}
                  <span>{site.address}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-stone-400" />
                <div className="text-stone-500">
                  <span className="font-medium text-stone-700">Địa chỉ cũ:</span>{" "}
                  <span>{site.oldAddress}</span>
                </div>
              </li>

              {/* Nút mở Google Maps theo tọa độ chính xác 14.00035, 107.9963 */}
              <li className="pt-0.5">
                <a
                  href={site.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 shadow-2xs transition hover:bg-brand-100 hover:border-brand-300"
                >
                  <MapPinIcon className="h-4 w-4 text-brand-600" />
                  Mở Google Maps (Chỉ đường) →
                </a>
              </li>

              <li className="flex items-center gap-2.5 pt-1">
                <ClockIcon className="h-4.5 w-4.5 shrink-0 text-brand-600" />
                <span>
                  <span className="font-medium text-stone-700">Thời gian phục vụ:</span>{" "}
                  <span className="inline-block rounded-md bg-brand-50 px-2 py-0.5 font-bold text-brand-700">
                    {site.hours}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-100 py-5 text-center text-xs text-stone-500">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>© 2026 {site.name}.</span>
          <span className="inline-flex items-center gap-1 font-medium text-stone-700">
            <VietnamFlag className="h-3.5 w-3.5" />
            Tự hào hàng Việt Nam chất lượng cao.
          </span>
          <span>Cam kết hàng như ảnh, đúng chất lượng, bảo hành uy tín.</span>
        </div>
      </div>
    </footer>
  );
}

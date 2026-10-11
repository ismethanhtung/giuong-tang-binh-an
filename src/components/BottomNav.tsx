"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { CartIcon, GridIcon, HomeIcon, PhoneIcon } from "./icons";

const items = [
  { href: "/", label: "Trang chủ", icon: HomeIcon },
  { href: "/san-pham", label: "Sản phẩm", icon: GridIcon },
  { href: "/gio-hang", label: "Giỏ hàng", icon: CartIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                active ? "text-brand-600" : "text-stone-500"
              }`}
            >
              <Icon className="h-6 w-6" />
              {label}
              {href === "/gio-hang" && count > 0 && (
                <span className="absolute right-[22%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
        <a
          href={site.phoneHref}
          className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-stone-500"
        >
          <PhoneIcon className="h-6 w-6" />
          Tư vấn
        </a>
      </div>
    </nav>
  );
}

import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HomeCtaButton from "@/components/HomeCtaButton";
import {
    BadgeCheckIcon,
    ChevronRightIcon,
    PhoneIcon,
    ShieldIcon,
    StarIcon,
    TruckIcon,
    WrenchIcon,
    ZaloIcon,
} from "@/components/icons";
import { categories } from "@/lib/products";
import { getProductsServer } from "@/lib/products-server";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function HomePage() {
    const products = getProductsServer();
    const featured = products.filter((p) => p.featured).slice(0, 8);
    const rest = products.filter((p) => !p.featured).slice(0, 4);

    return (
        <>
            {/* Hero */}
            <section className="relative isolate flex min-h-[27rem] items-center overflow-hidden bg-stone-900 sm:min-h-[36rem] lg:min-h-[38rem]">
                <Image
                    src="/images/anh-nen.jpg"
                    alt="Phòng ngủ ấm áp với giường tầng sắt bên cửa sổ nhìn ra đồi núi"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-[70%_center] sm:object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/50 to-stone-950/10" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/60 to-transparent" />

                <div className="relative mx-auto flex w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
                    <div className="animate-float-up max-w-xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                            <StarIcon className="h-3.5 w-3.5 text-brand-300" />
                            Kho giường tầng giá gốc Pleiku Gia Lai
                        </span>
                        <h1 className="mt-4 text-[24px] min-[375px]:text-[26px] font-extrabold leading-[1.2] tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-[2.75rem] sm:leading-[1.12]">
                            <span className="block">
                                Giường tầng, giường sắt
                            </span>
                            <span className="block bg-gradient-to-r from-brand-200 to-brand-400 bg-clip-text text-transparent">
                                Bền đẹp, giá tận xưởng
                            </span>
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-200 sm:text-base">
                            Kho giường tầng sắt Hoà Phát, giường sắt, giường gỗ,
                            tủ và bàn ghế giá tận xưởng tại Pleiku, Gia Lai.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href="/san-pham"
                                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand-500 px-5 text-sm font-bold text-white shadow-lg shadow-brand-900/40 ring-1 ring-brand-300/40 transition active:scale-95 hover:bg-brand-400"
                            >
                                Xem sản phẩm
                                <ChevronRightIcon className="h-4 w-4" />
                            </Link>
                            <a
                                href={site.phoneHref}
                                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-bold text-white shadow-sm backdrop-blur-md transition active:scale-95 hover:bg-white/20"
                            >
                                <PhoneIcon className="h-4.5 w-4.5" />
                                {site.phone}
                            </a>
                        </div>
                        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-stone-200 sm:text-sm">
                            {[
                                "Sắt thép Hoà Phát",
                                "Lắp đặt tận nhà",
                                "Giao hàng toàn quốc",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-1.5"
                                >
                                    <svg
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                        className="h-4 w-4 text-brand-300"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.36a.75.75 0 1 0-1.05-1.07l-3.7 3.64-1.9-1.86a.75.75 0 1 0-1.05 1.07l2.43 2.38a.75.75 0 0 0 1.05 0l4.22-4.16Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <div className="mx-auto w-full max-w-6xl px-4">
                {/* Categories */}
                <section className="mt-8">
                    <div className="flex items-end justify-between">
                        <h2 className="text-lg font-bold tracking-tight text-stone-900">
                            Danh mục
                        </h2>
                        <Link
                            href="/san-pham"
                            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Tất cả
                        </Link>
                    </div>
                    <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0">
                        {categories.map((c) => (
                            <Link
                                key={c.id}
                                href={`/san-pham?danh-muc=${c.id}`}
                                className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-3.5 text-center transition hover:border-brand-300 sm:w-auto"
                            >
                                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50/70 p-2 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={c.icon}
                                        alt={c.name}
                                        className="h-full w-full object-contain"
                                    />
                                </span>
                                <span className="text-xs font-semibold leading-snug text-stone-700">
                                    {c.short}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured */}
                <section className="mt-10">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-stone-900">
                                Sản phẩm nổi bật
                            </h2>
                            <p className="text-sm text-stone-500">
                                Được khách chọn nhiều nhất tuần này
                            </p>
                        </div>
                        <Link
                            href="/san-pham"
                            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {featured.map((p, idx) => (
                            <ProductCard
                                key={p.slug}
                                product={p}
                                priority={idx < 4}
                            />
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/san-pham"
                            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Xem thêm
                        </Link>
                    </div>
                </section>

                {/* CTA band */}
                <section className="mt-12 overflow-hidden rounded-3xl border border-brand-100 bg-brand-50/70 p-6 text-center sm:p-8">
                    <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                        Cần tư vấn giường phù hợp?
                    </h2>
                    <p className="mx-auto mt-2 max-w-lg text-sm text-stone-600">
                        Gọi hoặc chat Zalo, bên mình tư vấn kích thước, màu sắc
                        và báo giá trong vài phút.
                    </p>
                    <div className="mt-5 flex justify-center">
                        <HomeCtaButton />
                    </div>
                </section>

                {/* More products */}
                <section className="mt-12">
                    <div className="flex items-end justify-between">
                        <h2 className="text-lg font-bold tracking-tight text-stone-900">
                            Có thể bạn cũng thích
                        </h2>
                        <Link
                            href="/san-pham"
                            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {rest.map((p) => (
                            <ProductCard key={p.slug} product={p} />
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <Link
                            href="/san-pham"
                            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                        >
                            Xem thêm
                        </Link>
                    </div>
                </section>

                {/* Kho Giường Tầng, Giường Sắt Bình An Tại Pleiku, Gia Lai */}
                <section className="mt-14 mb-4 rounded-3xl border border-stone-200/80 bg-gradient-to-b from-white to-stone-50/50 p-6 sm:p-8 lg:p-10 shadow-sm">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                            Kho uy tín tại Pleiku
                        </span>
                        <h2 className="mt-3 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl lg:text-3xl">
                            Kho Giường Tầng, Giường Sắt Bình An Tại Pleiku, Gia
                            Lai
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                            <strong className="text-stone-900 font-semibold">
                                Giường tầng Bình An
                            </strong>{" "}
                            – địa chỉ trực tiếp gia công và phân phối các dòng{" "}
                            <strong className="text-stone-900 font-semibold">
                                giường tầng
                            </strong>
                            ,{" "}
                            <strong className="text-stone-900 font-semibold">
                                giường sắt tầng
                            </strong>
                            ,{" "}
                            <strong className="text-stone-900 font-semibold">
                                giường sắt hộp Hoà Phát
                            </strong>{" "}
                            giá tận xưởng tốt tại Gia Lai và khu vực Tây Nguyên.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-stone-200/70 bg-white p-4.5 shadow-xs">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                <ShieldIcon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-stone-900">
                                Sắt Hoà Phát chuẩn dày
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-stone-500">
                                Khung sắt hộp chịu lực cao tới 500kg, giát
                                giường đan chắc chắn, cam kết không rung lắc.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-stone-200/70 bg-white p-4.5 shadow-xs">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                <BadgeCheckIcon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-stone-900">
                                Sơn tĩnh điện cao cấp
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-stone-500">
                                Bề mặt phủ sơn tĩnh điện công nghệ cao, nhẵn mịn
                                chống trầy xước, ngăn ngừa rỉ sét tuyệt đối.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-stone-200/70 bg-white p-4.5 shadow-xs">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                <WrenchIcon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-stone-900">
                                Đủ kích thước & tiện ích
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-stone-500">
                                Đầy đủ các size 1m, 1m2, 1m4, 1m6; tích hợp hộc
                                kéo gầm và thang hộp để đồ thông minh.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-stone-200/70 bg-white p-4.5 shadow-xs">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                <TruckIcon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-stone-900">
                                Giao lắp tận nơi Gia Lai
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-stone-500">
                                Vận chuyển nhanh và hỗ trợ khiêng vác lắp đặt
                                tận phòng tại Pleiku và toàn tỉnh Gia Lai.
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 border-t border-stone-200/60 pt-5 text-xs sm:text-sm leading-relaxed text-stone-600 space-y-2.5">
                        <p>
                            Với nhiều năm kinh nghiệm sản xuất nội thất,{" "}
                            <strong>Kho giường sắt Bình An Gia Lai</strong> là
                            nơi cung cấp tin cậy của nhiều gia đình, chủ
                            homestay du lịch, ký túc xá trường học và phòng trọ
                            cho thuê trên địa bàn TP. Pleiku cũng như các huyện
                            lân cận (Đak Đoa, Chư Sê, An Khê, Ayun Pa, Mang
                            Yang, Đức Cơ...).
                        </p>
                        <p>
                            Các dòng sản phẩm chủ lực bao gồm:{" "}
                            <strong>giường tầng sắt 1m – 1m</strong>,{" "}
                            <strong>giường tầng sắt 1m – 1m2</strong>,{" "}
                            <strong>giường tầng sắt có hộc kéo gầm</strong>,{" "}
                            <strong>giường tầng thang hộp</strong>, cùng các mẫu{" "}
                            <strong>giường sắt bọc nệm</strong> và giường ngủ
                            hiện đại. Bên mình nhận đặt đóng kích thước theo yêu
                            cầu không gian phòng ngủ của khách hàng.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}

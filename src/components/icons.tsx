import type { ComponentProps } from "react";
import {
    Award,
    BadgeCheck,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Heart,
    Home,
    Image,
    LayoutGrid,
    MapPin,
    MessageCircle,
    Minus,
    Phone,
    Plus,
    Search,
    Share2,
    ShieldCheck,
    ShoppingCart,
    Star,
    Trash2,
    Truck,
    Wrench,
    X,
} from "lucide-react";

export type IconProps = ComponentProps<typeof Home>;

export const HomeIcon = Home;
export const GridIcon = LayoutGrid;
export const CartIcon = ShoppingCart;
export const SearchIcon = Search;
export const PhoneIcon = Phone;
export const MessageIcon = MessageCircle;
export const MapPinIcon = MapPin;
export const ClockIcon = Clock;
export const PlusIcon = Plus;
export const MinusIcon = Minus;
export const TrashIcon = Trash2;
export const ChevronRightIcon = ChevronRight;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronDownIcon = ChevronDown;
export const CheckIcon = Check;
export const TruckIcon = Truck;
export const ShieldIcon = ShieldCheck;
export const WrenchIcon = Wrench;
export const BadgeCheckIcon = BadgeCheck;
export const AwardIcon = Award;
export const HeartIcon = Heart;
export const ShareIcon = Share2;
export const ImageIcon = Image;
export const XIcon = X;

export function StarIcon({ className = "", ...props }: IconProps) {
    return (
        <Star
            className={className}
            fill="currentColor"
            strokeWidth={0}
            {...props}
        />
    );
}

export function FacebookIcon({
    className = "h-4 w-4",
    ...props
}: ComponentProps<"svg">) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

export function MessengerIcon({
    className = "h-4 w-4",
    ...props
}: ComponentProps<"svg">) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <path d="M12 0C5.239 0 0 4.978 0 11.5c0 3.715 1.71 7.026 4.394 9.173V24l3.193-1.753c1.36.377 2.806.58 4.413.58 6.761 0 12-4.978 12-11.5S18.761 0 12 0zm1.26 15.526-3.08-3.284-6.012 3.284 6.613-7.026 3.155 3.284 5.938-3.284-6.614 7.026z" />
        </svg>
    );
}

/**
 * Biểu tượng vector chữ "Zalo" chuẩn chính thức với nét đậm rõ nét
 */
export function ZaloIcon({
    className = "h-3.5 w-auto",
    ...props
}: ComponentProps<"svg">) {
    return (
        <svg
            viewBox="0 6.5 24 11"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9453 0 1.0746.8697 1.9453 1.945 1.9453z" />
        </svg>
    );
}

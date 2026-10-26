import type { ComponentProps } from "react";
import {
    Home,
    LayoutGrid,
    ShoppingCart,
    Search,
    Phone,
    MessageCircle,
    MapPin,
    Clock,
    Star,
    Plus,
    Minus,
    Trash2,
    ChevronRight,
    Check,
    Truck,
    ShieldCheck,
    Wrench,
    BadgeCheck,
    Award,
} from "lucide-react";

export type IconProps = ComponentProps<typeof Home>;

// Re-export Lucide icons with project-compatible names
export const HomeIcon = Home;
export const GridIcon = LayoutGrid;
export const CartIcon = ShoppingCart;
export const SearchIcon = Search;
export const PhoneIcon = Phone;
export const ChatIcon = MessageCircle;
export const MapPinIcon = MapPin;
export const ClockIcon = Clock;
export const PlusIcon = Plus;
export const MinusIcon = Minus;
export const TrashIcon = Trash2;
export const ChevronRightIcon = ChevronRight;
export const CheckIcon = Check;
export const TruckIcon = Truck;
export const ShieldIcon = ShieldCheck;
export const WrenchIcon = Wrench;
export const BadgeCheckIcon = BadgeCheck;
export const AwardIcon = Award;

// Star icon with customizable fill/stroke for rating display
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

// Brand icons: Facebook, Messenger, Zalo
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

export function ZaloIcon({
    className = "h-4 w-4",
    alt = "",
    ...props
}: ComponentProps<"img">) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src="/images/zalo.png"
            alt={alt}
            aria-hidden="true"
            className={`shrink-0 object-contain rounded-xs ${className}`}
            {...props}
        />
    );
}

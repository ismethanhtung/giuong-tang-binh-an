import type { SVGProps } from "react";

export default function VietnamFlag({
  className = "h-4 w-4",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`shrink-0 overflow-hidden rounded-xs shadow-xs ${className}`}
      aria-label="Cờ đỏ sao vàng Việt Nam"
      {...props}
    >
      <rect width="100" height="100" fill="#da251d" />
      <polygon
        points="50.00,18.00 57.18,40.11 80.43,40.11 61.62,53.78 68.81,75.89 50.00,62.22 31.19,75.89 38.38,53.78 19.57,40.11 42.82,40.11"
        fill="#ffff00"
      />
    </svg>
  );
}

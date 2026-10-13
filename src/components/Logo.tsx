export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo/bunk-bed.gif"
      alt="Giường tầng Bình An"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}

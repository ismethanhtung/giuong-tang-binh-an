import { StarIcon } from "./icons";

export default function Stars({
  rating,
  reviews,
  className = "",
}: {
  rating: number;
  reviews?: number;
  className?: string;
}) {
  const full = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`h-3.5 w-3.5 ${i < full ? "text-amber-400" : "text-stone-200"}`}
          />
        ))}
      </span>
      <span className="text-xs font-medium text-stone-500">
        {rating.toFixed(1)}
        {reviews != null && ` (${reviews})`}
      </span>
    </span>
  );
}

import { site } from "@config/site";
import { cn } from "@/lib/utils";
import { StarIcon } from "./Icon";

/**
 * Google-reviewscore. Toont niets zolang er geen echte score in de config staat.
 */
export function GoogleScore({ className, compact = false }: { className?: string; compact?: boolean }) {
  const reviews = site.googleReviews;
  if (!reviews) return null;

  const score = reviews.score.toLocaleString("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const label = `${score} van 5 sterren op basis van ${reviews.count} Google-reviews`;

  return (
    <a
      href={reviews.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opent in een nieuw tabblad)`}
      className={cn("inline-flex items-center gap-2 underline-offset-4 hover:underline", className)}
    >
      <span aria-hidden="true" className="flex text-brand">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon key={index} />
        ))}
      </span>
      <span aria-hidden="true">{compact ? `${score}/5` : `${score}/5 uit ${reviews.count} Google-reviews`}</span>
    </a>
  );
}

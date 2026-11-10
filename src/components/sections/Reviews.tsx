import { site } from "@config/site";
import { reviews } from "@content/reviews";
import { Card } from "@/components/ui/Card";
import { GoogleScore } from "@/components/ui/GoogleScore";
import { StarIcon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * Google-reviews. Toont niets zolang er geen echte reviews in /content/reviews.ts staan
 * of de functie in de config uit staat.
 */
export function Reviews({ limit = 6 }: { limit?: number }) {
  if (!site.features.reviews || reviews.length === 0) return null;

  return (
    <Section tone="sand" labelledBy="reviews-titel">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading id="reviews-titel" eyebrow="Reviews" title="Wat klanten over ons zeggen" />
        <GoogleScore className="font-medium" />
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, limit).map((review) => (
          <Card as="li" key={`${review.author}-${review.date}`} className="flex flex-col">
            <p className="flex text-brand" role="img" aria-label={`${review.rating} van 5 sterren`}>
              {Array.from({ length: review.rating }, (_, index) => (
                <StarIcon key={index} className="size-5" />
              ))}
            </p>
            <blockquote className="mt-4 grow">
              <p>{review.text}</p>
            </blockquote>
            <p className="mt-5 font-semibold">{review.author}</p>
            <p className="text-sm text-muted">Google-review</p>
          </Card>
        ))}
      </ul>
    </Section>
  );
}

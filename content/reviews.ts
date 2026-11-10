export interface Review {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** ISO-datum, bijvoorbeeld "2026-03-14". */
  date: string;
  source: "google";
  url: string | null;
}

/**
 * Alleen echte, letterlijk overgenomen Google-reviews. Geen verzonnen reviews.
 * Zolang deze lijst leeg is (of `site.features.reviews` uit staat) toont de site geen reviewsectie.
 *
 * TODO: aanleveren door klant (Google-reviews, of toegang tot het Google-bedrijfsprofiel)
 */
export const reviews: Review[] = [];

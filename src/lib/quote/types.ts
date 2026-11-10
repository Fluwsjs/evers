import type { ContactMoment, RoofType } from "@content/quote-options";

/**
 * Eén aanvraag, ongeacht via welk formulier die binnenkomt.
 *
 * Dit type is opgezet alsof de aanvraag in een database of dashboard terechtkomt:
 * elke aanvraag heeft een id, een tijdstip en een bron, en het terugbel- en
 * contactformulier vullen simpelweg minder velden. Nu gaat de aanvraag alleen per mail
 * naar het bedrijf; er wordt niets opgeslagen.
 */
export interface QuoteRequest {
  /** Leesbaar referentienummer, bijvoorbeeld "EV-20261110-K7QP". */
  id: string;
  /** ISO 8601. */
  createdAt: string;
  source: "offerte" | "calculator" | "terugbel" | "contact";

  /** Slugs van gekozen diensten, of "anders". Leeg bij een terugbelverzoek. */
  services: string[];
  roofType: RoofType | null;
  urgent: boolean;

  address: {
    postcode: string;
    houseNumber: string;
    street: string | null;
    city: string;
  } | null;

  /** Omschrijving van de klus, of het bericht uit het contactformulier. */
  description: string | null;
  photos: QuotePhoto[];

  contact: {
    name: string;
    /** Alleen bij het contactformulier optioneel. */
    phone: string | null;
    email: string | null;
    preferredMoment: ContactMoment;
  };

  /** Indicatie uit de prijscalculator, als de aanvraag daar vandaan komt (fase 8). */
  estimate: QuoteEstimate | null;

  consent: {
    privacy: boolean;
    /** ISO 8601. */
    at: string;
  };
}

export interface QuotePhoto {
  filename: string;
  contentType: string;
  /** Grootte in bytes zoals verzonden per mail (na verkleinen). */
  size: number;
}

export interface QuoteEstimate {
  lines: Array<{ label: string; quantity: number; unit: string; amountInclVat: number }>;
  totalInclVat: number;
}

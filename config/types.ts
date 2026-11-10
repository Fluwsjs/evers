/**
 * Types voor het centrale configbestand.
 *
 * Alles wat per dakdekkersbedrijf verschilt staat in `config/site.ts`.
 * Componenten lezen alleen uit de config en uit `/content`; er staat nergens
 * een bedrijfsnaam of telefoonnummer hard in een component. Daardoor is
 * dezelfde codebase later voor andere dakdekkers te gebruiken.
 *
 * Afspraak voor ontbrekende gegevens: de waarde is `null` (of een lege lijst)
 * met de opmerking `TODO: aanleveren door klant`. Componenten tonen een
 * onderdeel alleen als de gegevens er zijn.
 */

export type ServiceCategoryId = "renovatie" | "reparatie" | "specialistisch" | "aanvullend";

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  description: string;
}

export interface OpeningHoursEntry {
  /** Schema.org-dagen, bijvoorbeeld ["Monday", "Tuesday"]. */
  days: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday">;
  /** Label zoals het op de site komt, bijvoorbeeld "Maandag t/m vrijdag". */
  label: string;
  /** "07:00" – of `null` als het bedrijf die dag gesloten is. */
  opens: string | null;
  closes: string | null;
}

export interface GoogleReviews {
  score: number;
  count: number;
  url: string;
}

export interface KeyFigure {
  value: string;
  label: string;
}

export interface Brand {
  name: string;
  /** Pad onder /public, of `null` zolang er geen logo met toestemming is. */
  logo: string | null;
  url: string | null;
}

/** Eenheid waarin een prijs wordt gerekend: per vierkante meter, per strekkende meter of per stuk. */
export type PriceUnit = "m2" | "m1" | "stuk";

export interface PriceItem {
  /** Vaste sleutel; komt terug in links van de calculator naar het offerteformulier. */
  id: string;
  /** Dienst waar dit werk bij hoort (slug uit /content/services). */
  serviceSlug: string;
  /** Omschrijving van het werk zoals de bezoeker die ziet. */
  label: string;
  unit: PriceUnit;
  /** Vanaf-prijs per eenheid in euro, inclusief btw. `null` = "Prijs op aanvraag". */
  fromPrice: number | null;
  /** Laagste bedrag dat voor dit werk wordt gerekend, inclusief btw. `null` = geen minimum. */
  minimum: number | null;
  /**
   * `false` = voorbeeldprijs die de klant nog moet bevestigen. Onbevestigde prijzen
   * zijn alleen tijdens de bouw zichtbaar; op de live site staat er "Prijs op aanvraag".
   */
  confirmed: boolean;
}

/** Iconen die bij een pluspunt gekozen kunnen worden (zie src/components/ui/Icon.tsx). */
export type UspIcon = "document" | "badge" | "shield" | "home" | "clock" | "phone" | "pin" | "check";

export interface Usp {
  text: string;
  icon: UspIcon;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  /** Statutaire naam voor footer en juridische pagina's. */
  legalName: string | null;
  tagline: string;
  url: string;
  locale: string;

  owner: {
    name: string | null;
    role: string | null;
    photo: string | null;
  };

  contact: {
    /** Internationaal formaat zonder spaties, voor `tel:`-links. */
    phone: string;
    phoneDisplay: string;
    /** Alleen cijfers, landcode voorop, voor wa.me-links. */
    whatsapp: string | null;
    email: string;
  };

  address: {
    street: string | null;
    postalCode: string | null;
    city: string | null;
    region: string | null;
    country: string;
    /** Zolang dit `false` is wordt het adres niet op de site getoond. */
    confirmed: boolean;
  };

  registration: {
    kvk: string | null;
    vat: string | null;
  };

  openingHours: OpeningHoursEntry[] | null;

  emergency: {
    enabled: boolean;
    label: string;
  };

  socials: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
  };

  /** `null` = geen score tonen en geen aggregateRating in structured data. */
  googleReviews: GoogleReviews | null;

  usps: Usp[];
  /** Alleen echte cijfers. Leeg = sectie wordt niet getoond. */
  keyFigures: KeyFigure[];
  brands: Brand[];

  certifications: Array<{
    name: string;
    description: string | null;
    number: string | null;
  }>;

  warranty: {
    summary: string;
    /** Concrete termijnen, bijvoorbeeld "10 jaar op dakbedekking". */
    terms: string[];
  };

  services: {
    categories: ServiceCategory[];
    /** Slugs van de diensten die op de site actief zijn. */
    enabled: string[];
  };

  serviceArea: {
    summary: string | null;
    /** Regio voor in koppen, bijvoorbeeld "regio Arnhem". `null` = kop zonder regio. */
    regionLabel: string | null;
    /** Slugs van plaatsen met een eigen pagina (zie /content/places). */
    places: string[];
  };

  pricing: {
    /** Btw-tarief dat in de prijzen is inbegrepen, bijvoorbeeld 0.21. */
    vatRate: number;
    items: PriceItem[];
  };

  features: {
    calculator: boolean;
    reviews: boolean;
    beforeAfter: boolean;
    whatsapp: boolean;
  };
}

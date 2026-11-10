import type { ServiceCategoryId } from "@config/types";

/**
 * Basisgegevens per dienst: genoeg voor navigatie, kaarten en formulieren.
 * De volledige paginateksten volgen in fase 4.
 *
 * Of een dienst zichtbaar is bepaalt `site.services.enabled` in de config,
 * niet dit bestand.
 */
export interface ServiceSummary {
  slug: string;
  title: string;
  /** Korte naam voor menu's en keuzelijsten. */
  navTitle: string;
  category: ServiceCategoryId;
  shortDescription: string;
}

export const services: ServiceSummary[] = [
  // Diensten van de huidige site
  {
    slug: "dakrenovatie",
    title: "Dakrenovatie",
    navTitle: "Dakrenovatie",
    category: "renovatie",
    shortDescription: "Uw hellende dak vernieuwd: nieuwe pannen, panlatten en folie, met of zonder isolatie.",
  },
  {
    slug: "platte-daken",
    title: "Platte daken",
    navTitle: "Platte daken",
    category: "renovatie",
    shortDescription: "Nieuwe dakbedekking, renovatie en onderhoud van platte daken.",
  },
  {
    slug: "schoorsteenrenovatie",
    title: "Schoorsteenrenovatie",
    navTitle: "Schoorsteenrenovatie",
    category: "specialistisch",
    shortDescription: "Voegwerk, loodaansluitingen en afdekking van uw schoorsteen hersteld.",
  },
  {
    slug: "lood-en-zinkwerk",
    title: "Lood- en zinkwerk",
    navTitle: "Lood- en zinkwerk",
    category: "specialistisch",
    shortDescription: "Waterdichte aansluitingen, goten en afvoeren in lood en zink.",
  },
  {
    slug: "timmerwerk",
    title: "Timmerwerk",
    navTitle: "Timmerwerk",
    category: "aanvullend",
    shortDescription: "Dakconstructies, dakbeschot, boeidelen en herstel van houtwerk.",
  },
  {
    slug: "velux-dakramen",
    title: "VELUX dakramen",
    navTitle: "VELUX dakramen",
    category: "aanvullend",
    shortDescription: "Dakramen plaatsen of vervangen, waterdicht ingewerkt in uw dak.",
  },

  // Mogelijke extra diensten. Standaard uit; eerst met de klant afstemmen.
  {
    slug: "daklekkage",
    title: "Daklekkage en dakreparatie",
    navTitle: "Daklekkage & reparatie",
    category: "reparatie",
    shortDescription: "Lekkage opsporen en herstellen.",
  },
  {
    slug: "dakinspectie",
    title: "Dakinspectie",
    navTitle: "Dakinspectie",
    category: "reparatie",
    shortDescription: "Controle van uw dak met advies over wat nodig is.",
  },
  {
    slug: "stormschade",
    title: "Stormschade herstellen",
    navTitle: "Stormschade",
    category: "reparatie",
    shortDescription: "Herstel van schade na storm.",
  },
  {
    slug: "nokvorsten",
    title: "Nokvorsten",
    navTitle: "Nokvorsten",
    category: "reparatie",
    shortDescription: "Nokvorsten opnieuw vastzetten of vervangen.",
  },
  {
    slug: "dakisolatie",
    title: "Dakisolatie",
    navTitle: "Dakisolatie",
    category: "renovatie",
    shortDescription: "Isolatie van hellende en platte daken.",
  },
  {
    slug: "nieuwbouw",
    title: "Dakwerk bij nieuwbouw",
    navTitle: "Nieuwbouw",
    category: "renovatie",
    shortDescription: "Dakdekkerswerk voor nieuwbouwprojecten.",
  },
  {
    slug: "zakelijk-dakwerk",
    title: "Zakelijk dakwerk",
    navTitle: "Zakelijk dakwerk",
    category: "renovatie",
    shortDescription: "Dakwerk voor bedrijfspanden en VvE's.",
  },
  {
    slug: "dakgoten",
    title: "Dakgoten",
    navTitle: "Dakgoten",
    category: "specialistisch",
    shortDescription: "Dakgoten vervangen en herstellen.",
  },
];

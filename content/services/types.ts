import type { FaqItem } from "../faq";
import type { ImageKey } from "../images.generated";

export interface TitledText {
  title: string;
  text: string;
}

/**
 * Volledige inhoud van een dienstpagina.
 *
 * De teksten bevatten algemene vakkennis over dakwerk. Wat specifiek over het bedrijf
 * gaat (merken, garantie, VCA, vrijblijvende offerte) komt van de huidige site.
 * Alles wat de klant nog moet bevestigen heeft een `TODO: aanleveren door klant`.
 */
export interface ServiceDetail {
  slug: string;
  /** H1 van de pagina. */
  heading: string;
  /** Voor de <title>; het sitedeel wordt automatisch toegevoegd. */
  metaTitle: string;
  metaDescription: string;
  /** Inleiding in alinea's. */
  intro: string[];
  /** Foto bovenaan. `null` zolang er geen passende eigen foto is. */
  image: ImageKey | null;
  whenNeeded: {
    intro: string;
    items: TitledText[];
  };
  process: TitledText[];
  materials: {
    intro: string;
    items: TitledText[];
    /** Namen zoals in `site.brands`. */
    brands: string[];
  };
  /** Waar de prijs van afhangt. De vanaf-prijs zelf komt uit de config (fase 8). */
  priceFactors: string[];
  faq: FaqItem[];
  /** Slugs van verwante diensten, voor interne links. */
  related: string[];
}

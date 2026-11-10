/**
 * Plaatsen met een eigen pagina (/dakdekker-[slug]/).
 * Welke plaatsen actief zijn bepaalt `site.serviceArea.places`.
 * De volledige paginateksten volgen in fase 7; elke pagina krijgt echt lokale inhoud.
 */
export interface PlaceSummary {
  slug: string;
  name: string;
}

export const places: PlaceSummary[] = [
  { slug: "elst", name: "Elst" },
  { slug: "zutphen", name: "Zutphen" },
  { slug: "arnhem", name: "Arnhem" },
];

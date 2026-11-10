import type { ImageKey } from "./images.generated";

export interface Project {
  slug: string;
  /** Type werk + plaats. Elke titel is uniek. */
  title: string;
  type: "Nieuwbouw" | "Renovatie";
  place: string;
  /** Slug van de plaatsnaampagina, als die bestaat. */
  placeSlug: string | null;
  serviceSlugs: string[];
  /** Eén zin op basis van wat op de foto's te zien is. */
  summary: string;
  description: string | null;
  workDone: string[];
  materials: string[];
  duration: string | null;
  year: number | null;
  cover: ImageKey;
  images: ImageKey[];
  /**
   * Voor/na-paar voor de schuifvergelijking. Alleen invullen met twee echte foto's
   * vanuit (vrijwel) hetzelfde standpunt. Wordt getoond als `site.features.beforeAfter` aan staat.
   */
  beforeAfter?: { before: ImageKey; after: ImageKey; caption?: string };
  /** Pad op de oude WordPress-site, voor de 301-redirect. */
  legacyPath: string;
}

export const projects: Project[] = [
  {
    slug: "nieuwbouw-zutphen",
    title: "Nieuwbouw Zutphen",
    type: "Nieuwbouw",
    place: "Zutphen",
    placeSlug: "zutphen",
    serviceSlugs: ["dakrenovatie"], // TODO: aanleveren door klant (welke diensten hier zijn uitgevoerd)
    summary: "Pannendaken met kilgoten en dakramen op nieuwbouwwoningen in Zutphen.",
    description: null, // TODO: aanleveren door klant (omschrijving van het project)
    workDone: [], // TODO: aanleveren door klant (wat er gedaan is)
    materials: [], // TODO: aanleveren door klant (gebruikte materialen en merken)
    duration: null, // TODO: aanleveren door klant
    year: null, // TODO: aanleveren door klant
    cover: "zutphen1",
    images: ["zutphen1", "zutphen2", "zutphen3"],
    legacyPath: "/nieuwbouw/",
  },
  {
    slug: "nieuwbouw-schuytgraaf-arnhem",
    title: "Nieuwbouw Schuytgraaf, Arnhem",
    type: "Nieuwbouw",
    place: "Arnhem",
    placeSlug: "arnhem",
    serviceSlugs: ["dakrenovatie"], // TODO: aanleveren door klant (welke diensten hier zijn uitgevoerd)
    summary: "Pannendaken voor meerdere woonblokken in de nieuwbouwwijk Schuytgraaf.",
    description: null, // TODO: aanleveren door klant (omschrijving van het project)
    workDone: [], // TODO: aanleveren door klant (wat er gedaan is)
    materials: [], // TODO: aanleveren door klant (gebruikte materialen en merken)
    duration: null, // TODO: aanleveren door klant
    year: null, // TODO: aanleveren door klant
    cover: "schuytgraaf1",
    images: [
      "schuytgraaf1",
      "schuytgraaf5",
      "schuytgraaf2",
      "schuytgraaf7",
      "schuytgraaf4",
      "schuytgraaf3",
      "schuytgraaf6",
    ],
    legacyPath: "/nieuwbouw-schuytgraaf/",
  },
  {
    slug: "dakrenovatie-elst",
    title: "Dakrenovatie Elst",
    type: "Renovatie",
    place: "Elst",
    placeSlug: "elst",
    serviceSlugs: ["dakrenovatie", "lood-en-zinkwerk"], // TODO: aanleveren door klant (welke diensten hier zijn uitgevoerd)
    summary: "Nieuw pannendak rond bestaande dakkapellen, met nieuwe goten, in Elst.",
    description: null, // TODO: aanleveren door klant (omschrijving van het project)
    workDone: [], // TODO: aanleveren door klant (wat er gedaan is)
    materials: [], // TODO: aanleveren door klant (gebruikte materialen en merken)
    duration: null, // TODO: aanleveren door klant
    year: null, // TODO: aanleveren door klant
    cover: "elst2",
    images: ["elst2", "elst1", "elst3", "elst4", "elst7", "elst8", "elst5", "elst6"],
    legacyPath: "/renovatie-elst/",
  },
];

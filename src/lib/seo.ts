import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { site } from "@config/site";

/** Volledige URL van een pad op de site, voor canonical, sitemap en structured data. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Pad van de deelafbeelding (Open Graph) voor een pagina. De afbeeldingen worden gemaakt
 * door `npm run og` en staan in /public/og/. Bestaat er voor een pagina geen eigen
 * afbeelding, dan geldt de algemene.
 */
export function ogImagePath(key?: string): string {
  if (key && existsSync(join(process.cwd(), "public", "og", `${key}.jpg`))) return `/og/${key}.jpg`;
  return "/og/standaard.jpg";
}

interface PageMetadataInput {
  /** Pad van de pagina, met slash aan het begin en eind. Wordt de canonical. */
  path: string;
  /** Titel zonder bedrijfsnaam; die komt er via het sjabloon in de layout achter. */
  title: string | { absolute: string };
  description?: string;
  /** Sleutel van de deelafbeelding in /public/og/ (zonder .jpg). */
  image?: string;
  /** Omschrijving van de deelafbeelding. */
  imageAlt?: string;
  robots?: Metadata["robots"];
}

/**
 * Metadata voor één pagina: titel, omschrijving, canonical, Open Graph en Twitter-card.
 * Elke pagina gebruikt deze functie, zodat geen pagina een onderdeel mist.
 */
export function pageMetadata({ path, title, description, image, imageAlt, robots }: PageMetadataInput): Metadata {
  const fullTitle = typeof title === "string" ? `${title} | ${site.shortName}` : title.absolute;
  const images = [{ url: ogImagePath(image), ...OG_SIZE, alt: imageAlt ?? fullTitle }];

  return {
    title,
    description,
    alternates: { canonical: path },
    robots,
    openGraph: {
      type: "website",
      locale: site.locale.replace("-", "_"),
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((item) => item.url),
    },
  };
}

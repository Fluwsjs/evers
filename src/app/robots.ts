import type { MetadataRoute } from "next";
import { absoluteUrl, noindexSite } from "@/lib/seo";
import { routes } from "@/lib/site";

/**
 * /robots.txt: alles mag worden bezocht, behalve de formulier-API en de bedankpagina.
 *
 * Bij een testversie (SITE_NOINDEX) blijft bezoeken toegestaan, zodat zoekmachines de
 * noindex op de pagina's kunnen lezen; alleen de verwijzing naar de sitemap vervalt.
 */
export default function robots(): MetadataRoute.Robots {
  if (noindexSite) {
    return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", routes.thanks] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { routes } from "@/lib/site";

/** /robots.txt: alles mag worden bezocht, behalve de formulier-API en de bedankpagina. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", routes.thanks] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

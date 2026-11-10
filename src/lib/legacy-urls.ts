import { projects } from "@content/projects";

/**
 * Wat er met de URL's van de oude WordPress-site gebeurt.
 *
 * - 301: de pagina heeft een opvolger op de nieuwe site.
 * - 410: de pagina is bewust weg en komt niet terug. Dat geldt voor de Engelstalige
 *   demo-inhoud van het WordPress-thema (blogposts, categorieën, tags) en voor de
 *   technische WordPress-adressen. Een 410 haalt ze sneller uit Google dan een 404, en
 *   doorsturen naar de homepage zou zoekmachines op het verkeerde been zetten.
 *
 * De lijst komt uit /wp-sitemap.xml van de oude site (gecontroleerd op 10 november 2026).
 * /over-ons/, /diensten/, /projecten/ en /contact/ houden hun adres en staan hier dus niet.
 */
export type LegacyResult = { type: "redirect"; to: string } | { type: "gone" };

const REDIRECTS: Record<string, string> = {
  // Projectpagina's: het oude pad staat bij het project in /content/projects.ts.
  ...Object.fromEntries(projects.map((project) => [stripSlash(project.legacyPath), `/projecten/${project.slug}/`])),
  // Demopagina's van het thema met een logische opvolger.
  "/home": "/",
  "/home-two": "/",
  "/home-four": "/",
  "/sample-page": "/",
  "/services-details": "/diensten/",
  "/project-details": "/projecten/",
  "/team": "/over-ons/",
  "/team-details": "/over-ons/",
  "/wp-sitemap.xml": "/sitemap.xml",
};

/** Demo-blogposts van het thema en losse WordPress-adressen. */
const GONE = new Set([
  "/hello-world",
  "/full-shot-roofers-working-together-with-helmets",
  "/hard-hatswork-at-the-heavy-manufacturing-factory-industrial",
  "/twin-cities-commercial-roofing-services",
  "/building-worker-help-each-other-with-at-construction-site",
  "/aerial-view-of-a-private-house-with-on-rooftop-services",
  "/medium-shot-men-working-on-roof-presentation",
  "/free-photo-cute-family-a-roof-above-their-head",
  "/as-a-leading-provider-of-exceptional-roofing-services",
  "/our-company-has-helped-hundreds-of-homeowners-and-businesses",
  "/rated-hail-and-storm-damage-repair-in-colorado",
  "/blog",
  "/feed",
  "/comments/feed",
  "/wp-login.php",
  "/xmlrpc.php",
  "/wp-cron.php",
]);

/** Alles onder deze paden is weg: archieven van de demo-inhoud en WordPress zelf. */
const GONE_PREFIXES = ["/category", "/tag", "/author", "/elementor-hf", "/wp-admin", "/wp-json", "/wp-content", "/wp-includes"];

function stripSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/**
 * Bepaalt wat er met een pad moet gebeuren. `null` = geen oud adres; de nieuwe site
 * handelt het verzoek gewoon af.
 */
export function resolveLegacyUrl(pathname: string): LegacyResult | null {
  const path = stripSlash(pathname.toLowerCase());

  const target = REDIRECTS[path];
  if (target) return { type: "redirect", to: target };
  if (/^\/wp-sitemap[\w-]*\.xml$/.test(path)) return { type: "redirect", to: "/sitemap.xml" };

  if (GONE.has(path)) return { type: "gone" };
  if (GONE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return { type: "gone" };
  // Feeds van oude pagina's, zoals /over-ons/feed/.
  if (path.endsWith("/feed")) return { type: "gone" };

  return null;
}

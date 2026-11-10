import type { MetadataRoute } from "next";
import { projects } from "@content/projects";
import { hasVisiblePrices } from "@/lib/pricing/price-list";
import { absoluteUrl } from "@/lib/seo";
import { getActivePlaces, getActiveServices, placeHref, projectHref, routes, serviceHref } from "@/lib/site";

/**
 * /sitemap.xml: alle pagina's die in zoekmachines mogen staan.
 *
 * Niet opgenomen: de bedankpagina, de algemene voorwaarden (noindex tot de tekst er is)
 * en /prijzen/ zolang er geen bevestigde prijzen zijn. Er staat geen wijzigingsdatum bij:
 * een verzonnen datum is slechter dan geen datum.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    routes.home,
    routes.services,
    ...getActiveServices().map((service) => serviceHref(service.slug)),
    routes.projects,
    ...projects.map((project) => projectHref(project.slug)),
    routes.serviceArea,
    ...getActivePlaces().map((place) => placeHref(place.slug)),
    ...(hasVisiblePrices() ? [routes.prices] : []),
    routes.quote,
    routes.about,
    routes.faq,
    routes.contact,
    routes.privacy,
  ];

  return paths.map((path) => ({ url: absoluteUrl(path) }));
}

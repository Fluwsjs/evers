import { site } from "@config/site";
import type { ServiceCategory } from "@config/types";
import { places, type Place } from "@content/places";
import { projects, type Project } from "@content/projects";
import { quoteParams } from "@content/quote-options";
import { services, type ServiceSummary } from "@content/services";

export interface ServiceGroup {
  category: ServiceCategory;
  services: ServiceSummary[];
}

/** Actieve diensten, in de volgorde van `site.services.enabled`. */
export function getActiveServices(): ServiceSummary[] {
  return site.services.enabled
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is ServiceSummary => service !== undefined);
}

/** Actieve diensten per categorie. Lege categorieën vallen weg. */
export function getServiceGroups(): ServiceGroup[] {
  const active = getActiveServices();
  return site.services.categories
    .map((category) => ({
      category,
      services: active.filter((service) => service.category === category.id),
    }))
    .filter((group) => group.services.length > 0);
}

export function serviceHref(slug: string): string {
  return `/diensten/${slug}/`;
}

/** Vaste routes, zodat links op één plek staan. */
export const routes = {
  home: "/",
  services: "/diensten/",
  projects: "/projecten/",
  serviceArea: "/werkgebied/",
  prices: "/prijzen/",
  quote: "/offerte-aanvragen/",
  about: "/over-ons/",
  faq: "/veelgestelde-vragen/",
  contact: "/contact/",
  privacy: "/privacyverklaring/",
  terms: "/algemene-voorwaarden/",
  thanks: "/bedankt/",
} as const;

/**
 * Ontbrekende klantgegevens zichtbaar maken tijdens de bouw.
 * In productie alleen als NEXT_PUBLIC_SHOW_TODOS expliciet op "true" staat.
 */
export const showTodos =
  process.env.NEXT_PUBLIC_SHOW_TODOS === "true" ||
  (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SHOW_TODOS !== "false");

export function projectHref(slug: string): string {
  return `/projecten/${slug}/`;
}

export function placeHref(slug: string): string {
  return `/dakdekker-${slug}/`;
}

/** Plaatsen met een eigen pagina, in de volgorde van `site.serviceArea.places`. */
export function getActivePlaces(): Place[] {
  return site.serviceArea.places
    .map((slug) => places.find((place) => place.slug === slug))
    .filter((place): place is Place => place !== undefined);
}

/** "Elst, Zutphen en Arnhem" */
export function formatList(items: string[]): string {
  return new Intl.ListFormat("nl-NL", { style: "long", type: "conjunction" }).format(items);
}

export function getService(slug: string): ServiceSummary | undefined {
  return getActiveServices().find((service) => service.slug === slug);
}

/** Link naar het offerteformulier, eventueel met een dienst alvast geselecteerd. */
export function quoteHref(serviceSlug?: string): string {
  return serviceSlug ? `${routes.quote}?${quoteParams.service}=${serviceSlug}` : routes.quote;
}

/** Projecten waarin een dienst is uitgevoerd. */
export function getProjectsForService(serviceSlug: string): Project[] {
  return projects.filter((project) => project.serviceSlugs.includes(serviceSlug));
}

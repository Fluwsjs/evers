import { site } from "@config/site";
import type { FaqItem } from "@content/faq";
import type { ServiceSummary } from "@content/services";
import { getPriceList } from "@/lib/pricing/price-list";
import { absoluteUrl, ogImagePath } from "@/lib/seo";
import { getActivePlaces, getActiveServices, serviceHref } from "@/lib/site";

/**
 * Structured data (JSON-LD, schema.org). Er komt alleen in wat echt in de config staat:
 * geen adres zolang het niet bevestigd is, geen openingstijden of reviewscore zolang die
 * ontbreken, en geen prijzen die de klant nog niet heeft bevestigd.
 */
type JsonLdObject = Record<string, unknown>;

export const BUSINESS_ID = `${absoluteUrl("/")}#bedrijf`;
const WEBSITE_ID = `${absoluteUrl("/")}#website`;

/** Verwijdert lege waarden, zodat er geen halve eigenschappen in de uitvoer komen. */
function compact(object: JsonLdObject): JsonLdObject {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)),
  );
}

const areaServed = () => getActivePlaces().map((place) => ({ "@type": "City", name: place.name }));

const unitText = { m2: "m²", m1: "m", stuk: "stuk" } as const;

/** Het bedrijf: `RoofingContractor`, een specifiek soort `LocalBusiness`. Staat op elke pagina. */
export function businessJsonLd(): JsonLdObject {
  const { address, contact, googleReviews, openingHours, registration, socials } = site;

  return compact({
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl("/"),
    image: absoluteUrl(ogImagePath()),
    telephone: contact.phone,
    email: contact.email,
    address:
      address.confirmed && address.street && address.city
        ? compact({
            "@type": "PostalAddress",
            streetAddress: address.street,
            postalCode: address.postalCode,
            addressLocality: address.city,
            addressRegion: address.region,
            addressCountry: address.country,
          })
        : null,
    areaServed: areaServed(),
    openingHoursSpecification: (openingHours ?? [])
      .filter((entry) => entry.opens && entry.closes)
      .map((entry) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: entry.days.map((day) => `https://schema.org/${day}`),
        opens: entry.opens,
        closes: entry.closes,
      })),
    vatID: registration.vat,
    identifier: registration.kvk ? { "@type": "PropertyValue", propertyID: "KVK", value: registration.kvk } : null,
    sameAs: [socials.facebook, socials.instagram, socials.linkedin, googleReviews?.url].filter(Boolean),
    aggregateRating: googleReviews
      ? {
          "@type": "AggregateRating",
          ratingValue: googleReviews.score,
          reviewCount: googleReviews.count,
          bestRating: 5,
        }
      : null,
    makesOffer: getActiveServices().map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title, url: absoluteUrl(serviceHref(service.slug)) },
    })),
  });
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: site.name,
    inLanguage: site.locale,
    publisher: { "@id": BUSINESS_ID },
  };
}

/** Eén dienst, met vanaf-prijzen als de klant die heeft bevestigd. */
export function serviceJsonLd(service: ServiceSummary, description: string): JsonLdObject {
  const offers = getPriceList()
    .filter((item) => item.serviceSlug === service.slug && item.unitPrice !== null && !item.example)
    .map((item) => ({
      "@type": "Offer",
      name: item.label,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: item.unitPrice,
        priceCurrency: "EUR",
        unitText: unitText[item.unit],
        valueAddedTaxIncluded: true,
        description: "Vanaf-prijs; de definitieve prijs volgt na een inspectie.",
      },
    }));

  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(serviceHref(service.slug))}#dienst`,
    name: service.title,
    serviceType: service.title,
    description,
    url: absoluteUrl(serviceHref(service.slug)),
    provider: { "@id": BUSINESS_ID },
    areaServed: areaServed(),
    offers,
  });
}

export function faqJsonLd(items: FaqItem[]): JsonLdObject | null {
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Kruimelpad. Het laatste item is de huidige pagina en krijgt geen link. */
export function breadcrumbJsonLd(items: Array<{ label: string; href?: string }>): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) =>
      compact({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: item.href && index < items.length - 1 ? absoluteUrl(item.href) : null,
      }),
    ),
  };
}

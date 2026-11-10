import { site } from "@config/site";
import { projects } from "@content/projects";
import { hasVisiblePrices } from "@/lib/pricing/price-list";
import { absoluteUrl } from "@/lib/seo";
import { inSentence } from "@/lib/utils";
import { formatList, getActivePlaces, getActiveServices, placeHref, projectHref, routes, serviceHref } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt: een korte, feitelijke samenvatting van de site voor AI-assistenten, in het
 * formaat van llmstxt.org. Alles komt uit de config en de content; wat daar ontbreekt
 * (adres, openingstijden) staat er dus ook hier niet in.
 */
export function GET() {
  const { address, contact, openingHours } = site;
  const services = getActiveServices();
  const places = getActivePlaces();
  const link = (label: string, path: string, note?: string) => `- [${label}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name} is een dakdekkersbedrijf voor renovatie en nieuwbouw. Diensten: ${formatList(services.map((service) => inSentence(service.title)))}. ${site.usps.map((usp) => usp.text).join(". ")}.`,
    "",
    "## Contact",
    "",
    `- Telefoon: ${contact.phoneDisplay} (${contact.phone})`,
    `- E-mail: ${contact.email}`,
    ...(address.confirmed && address.street && address.city
      ? [`- Adres: ${address.street}, ${[address.postalCode, address.city].filter(Boolean).join(" ")}`]
      : []),
    ...(openingHours ?? []).map((entry) =>
      `- ${entry.label}: ${entry.opens && entry.closes ? `${entry.opens}–${entry.closes}` : "gesloten"}`,
    ),
    ...(places.length > 0 ? [`- Werkt onder meer in: ${formatList(places.map((place) => place.name))}`] : []),
    link("Offerte aanvragen", routes.quote, "formulier in drie stappen, met de mogelijkheid om foto's mee te sturen"),
    link("Contact", routes.contact),
    "",
    "## Diensten",
    "",
    ...services.map((service) => link(service.title, serviceHref(service.slug), service.shortDescription)),
    "",
    "## Projecten",
    "",
    ...projects.map((project) => link(project.title, projectHref(project.slug), project.summary)),
    "",
    "## Werkgebied",
    "",
    link("Werkgebied", routes.serviceArea),
    ...places.map((place) => link(`Dakdekker ${place.name}`, placeHref(place.slug))),
    "",
    "## Meer informatie",
    "",
    ...(hasVisiblePrices() ? [link("Prijzen en calculator", routes.prices, "vanaf-prijzen inclusief btw; indicatief")] : []),
    link("Veelgestelde vragen", routes.faq),
    link("Over ons", routes.about),
    link("Privacyverklaring", routes.privacy),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

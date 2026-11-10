import { site } from "@config/site";
import { getServiceGroups, routes, serviceHref } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { HeaderNav, type NavServiceGroup } from "./HeaderNav";

/** Hoofdnavigatie naast het dienstenmenu. */
const mainLinks = [
  { label: "Projecten", href: routes.projects },
  { label: "Prijzen", href: routes.prices },
  { label: "Werkgebied", href: routes.serviceArea },
  { label: "Over ons", href: routes.about },
  { label: "Contact", href: routes.contact },
];

export function Header() {
  const groups: NavServiceGroup[] = getServiceGroups().map(({ category, services }) => ({
    title: category.title,
    description: category.description,
    links: services.map((service) => ({
      label: service.navTitle,
      description: service.shortDescription,
      href: serviceHref(service.slug),
    })),
  }));

  return (
    <HeaderNav
      siteName={site.name}
      groups={groups}
      links={mainLinks}
      servicesHref={routes.services}
      quoteHref={routes.quote}
      phone={{ href: telHref(site.contact.phone), display: site.contact.phoneDisplay }}
    />
  );
}

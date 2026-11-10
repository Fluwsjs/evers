import type { Metadata } from "next";
import { site } from "@config/site";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getActiveServices, routes } from "@/lib/site";
import { telHref } from "@/lib/utils";

/**
 * Tijdelijke pagina voor fase 2: laat het fundament zien (layout, tokens, basiscomponenten).
 * Wordt in fase 3 vervangen door de echte homepage. Tot dan niet indexeren.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "ink", className: "bg-ink" },
  { name: "ink-700", className: "bg-ink-700" },
  { name: "muted", className: "bg-muted" },
  { name: "brand", className: "bg-brand" },
  { name: "brand-strong", className: "bg-brand-strong" },
  { name: "brand-soft", className: "bg-brand-soft" },
  { name: "sand", className: "bg-sand" },
  { name: "sand-200", className: "bg-sand-200" },
  { name: "line", className: "bg-line" },
];

export default function HomePage() {
  const services = getActiveServices();

  return (
    <>
      <Section tone="sand">
        <Badge tone="dark">Fase 2: fundament</Badge>
        <SectionHeading
          as="h1"
          className="mt-5"
          title="Dakdekker voor renovatie en nieuwbouw"
          intro="Dit is een tijdelijke pagina. Ze laat de layout, de kleuren, de typografie en de basiscomponenten zien. De echte homepage volgt in fase 3."
        />
        <ul className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:max-w-2xl">
          {site.usps.map((usp) => (
            <li key={usp} className="flex items-center gap-3 font-medium">
              <Icon name="check" className="text-brand-strong" />
              {usp}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={routes.quote} size="lg">
            Offerte aanvragen
            <Icon name="arrow-right" />
          </ButtonLink>
          <ButtonLink href={telHref(site.contact.phone)} variant="outline" size="lg">
            <Icon name="phone" />
            Bel {site.contact.phoneDisplay}
          </ButtonLink>
        </div>
      </Section>

      <Section labelledBy="kleuren">
        <SectionHeading
          id="kleuren"
          eyebrow="Design tokens"
          title="Kleuren uit het Evers-logo"
          intro="Zwart en oranje uit het logo, aangevuld met warme neutrale tinten. Het oranje is een accentkleur en wordt nooit voor lopende tekst gebruikt."
        />
        <ul className="mt-10 grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-9">
          {swatches.map((swatch) => (
            <li key={swatch.name}>
              <div className={`h-20 rounded-card border border-line ${swatch.className}`} />
              <p className="mt-2 text-sm font-medium">{swatch.name}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand" labelledBy="componenten">
        <SectionHeading id="componenten" eyebrow="Basiscomponenten" title="Knoppen, kaarten en labels" />
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button>Primair</Button>
          <Button variant="dark">Donker</Button>
          <Button variant="outline">Omlijnd</Button>
          <Button variant="ghost">Subtiel</Button>
          <Button disabled>Uitgeschakeld</Button>
          <Badge>Neutraal</Badge>
          <Badge tone="brand">Accent</Badge>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={(index % 3) * 80} className="h-full">
                <Card className="h-full">
                  <h3 className="text-xl">{service.title}</h3>
                  <p className="mt-2 text-muted">{service.shortDescription}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ink" labelledBy="donker">
        <SectionHeading
          id="donker"
          eyebrow="Donkere sectie"
          title="Zo ziet een donker vlak eruit"
          intro="Voor afsluitende oproepen en de footer."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={routes.quote}>Offerte aanvragen</ButtonLink>
          <ButtonLink href={routes.contact} variant="outline-on-dark">
            Contact opnemen
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

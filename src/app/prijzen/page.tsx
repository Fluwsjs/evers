import type { Metadata } from "next";
import { site } from "@config/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { PriceCalculatorSection } from "@/components/sections/PriceCalculatorSection";
import { PriceTableSection } from "@/components/sections/PriceTable";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getPriceGroups, hasVisiblePrices } from "@/lib/pricing/price-list";
import { pageMetadata } from "@/lib/seo";

const pricesVisible = hasVisiblePrices();

export const metadata: Metadata = pageMetadata({
  path: "/prijzen/",
  title: pricesVisible ? "Prijzen: wat kost een dakdekker?" : "Prijzen",
  description: pricesVisible
    ? `Vanaf-prijzen van ${site.name} per m², per meter en per stuk. Bereken met de calculator een indicatie inclusief btw en vraag direct een offerte aan.`
    : `Wat bepaalt de prijs van dakwerk? Vraag een vrijblijvende offerte aan bij ${site.name}.`,
  // Zonder prijzen heeft deze pagina zoekers weinig te bieden; dan blijft ze uit de index.
  ...(pricesVisible ? {} : { robots: { index: false, follow: true } }),
});

/** Wat de prijs van dakwerk bepaalt. Algemene vakkennis, geen toezeggingen van het bedrijf. */
const priceFactors = [
  {
    title: "Oppervlakte en vorm",
    text: "Een groter dak kost meer, maar de vorm telt ook mee. Een dak met dakkapellen, kilgoten en veel aansluitingen vraagt meer werk per vierkante meter dan een recht dakvlak.",
  },
  {
    title: "Staat van de ondergrond",
    text: "Pas als de oude dakbedekking eraf is, is goed te zien hoe het dakbeschot en de constructie eraan toe zijn. Aangetast hout moet eerst worden hersteld.",
  },
  {
    title: "Bereikbaarheid",
    text: "De hoogte van het dak en de ruimte rond de woning bepalen of er een steiger nodig is en hoe materiaal op het dak komt.",
  },
  {
    title: "Materiaalkeuze",
    text: "Er zit verschil in prijs en levensduur tussen soorten dakpannen, dakbedekking, isolatie en dakramen. In de offerte leggen wij de keuzes naast elkaar.",
  },
];

export default function PricesPage() {
  const groups = getPriceGroups();

  return (
    <>
      <Breadcrumbs items={[{ label: "Prijzen" }]} />
      <PageHeader
        title="Wat kost een dakdekker?"
        intro={
          pricesVisible
            ? "Op deze pagina vindt u onze vanaf-prijzen en kunt u zelf een indicatie berekenen. De definitieve prijs hoort u na een inspectie van uw dak, in een vrijblijvende offerte."
            : "De prijs van dakwerk hangt af van uw dak. Hieronder leest u wat de prijs bepaalt. Voor een prijs voor uw situatie maken wij graag een vrijblijvende offerte."
        }
      />

      <PriceCalculatorSection title={pricesVisible ? "Bereken uw indicatie" : "Een prijs voor uw dak"} eyebrow="Calculator" />

      <PriceTableSection />

      <Section labelledBy="prijsfactoren-titel" tone={groups.length > 0 ? "white" : "sand"}>
        <SectionHeading
          id="prijsfactoren-titel"
          eyebrow="Goed om te weten"
          title="Wat bepaalt de prijs van uw dak?"
          intro="Twee daken van dezelfde grootte kunnen flink in prijs verschillen. Dit zijn de vier dingen die het meeste uitmaken."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {priceFactors.map((factor) => (
            <Card as="li" key={factor.title}>
              <h3 className="text-lg">{factor.title}</h3>
              <p className="mt-2 text-muted">{factor.text}</p>
            </Card>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-lg">
          Daarom komen wij altijd eerst kijken voordat wij een prijs afgeven. In de offerte staat wat wij doen, met
          welke materialen en wat het kost.
        </p>
      </Section>

      <CtaBand
        title="Een prijs voor uw dak?"
        text="Vertel ons wat er moet gebeuren en stuur gerust foto's mee. U ontvangt een vrijblijvende offerte."
      />
    </>
  );
}

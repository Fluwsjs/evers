import type { Metadata } from "next";
import { site } from "@config/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getServiceGroups } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/diensten/",
  title: "Diensten: dakrenovatie, platte daken, lood- en zinkwerk",
  description: `Alle diensten van ${site.name} op een rij: dakrenovatie, platte daken, schoorsteenrenovatie, lood- en zinkwerk, timmerwerk en VELUX dakramen.`,
});

/** Dienstenoverzicht, gegroepeerd per categorie. Elke dienst linkt naar een eigen pagina. */
export default function ServicesPage() {
  const groups = getServiceGroups();

  return (
    <>
      <Breadcrumbs items={[{ label: "Diensten" }]} />

      <section aria-labelledby="diensten-titel" className="bg-sand py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 id="diensten-titel" className="text-3xl sm:text-4xl md:text-5xl">
              Onze diensten: alles voor een dicht en degelijk dak
            </h1>
            <p className="mt-5 text-lg text-muted">
              Wij werken aan hellende en platte daken, bij renovatie en in de nieuwbouw. Hieronder vindt u per soort
              werk wat wij doen, wanneer het nodig is en hoe wij het aanpakken.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
              {site.usps.map((usp) => (
                <li key={usp} className="flex items-center gap-3 font-medium">
                  <Icon name="check" className="text-brand-strong" />
                  {usp}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {groups.map((group, index) => {
        const headingId = `categorie-${group.category.id}`;
        return (
          <section
            key={group.category.id}
            aria-labelledby={headingId}
            className={`py-12 md:py-16 ${index % 2 === 0 ? "bg-white" : "bg-sand"}`}
          >
            <Container className="grid gap-8 lg:grid-cols-[1fr_2.4fr] lg:gap-12">
              <div>
                <span aria-hidden="true" className="mb-4 block h-0.5 w-8 bg-brand" />
                <h2 id={headingId} className="text-3xl">
                  {group.category.title}
                </h2>
                <p className="mt-3 text-lg text-muted">{group.category.description}</p>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2">
                {group.services.map((service) => (
                  <li key={service.slug}>
                    <ServiceCard service={service} />
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        );
      })}

      <ProcessSteps />

      <CtaBand
        title="Weet u nog niet precies wat er nodig is?"
        text="Dat hoeft ook niet. Omschrijf uw situatie en stuur foto's mee; wij denken met u mee en maken een vrijblijvende offerte."
      />
    </>
  );
}

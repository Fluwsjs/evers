import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getActiveServices, routes, serviceHref } from "@/lib/site";

/**
 * Diensten als kaarten. De vanaf-prijs per dienst komt erbij in fase 8;
 * een dienst zonder ingevulde prijs toont dan geen bedrag.
 */
export function ServiceCards() {
  const services = getActiveServices();

  return (
    <Section tone="sand" labelledBy="diensten-titel">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="diensten-titel"
          eyebrow="Diensten"
          title="Wat wij voor uw dak doen"
          intro="Van een compleet nieuw dak tot de aansluiting rond één schoorsteen."
        />
        <ButtonLink href={routes.services} variant="outline">
          Alle diensten
          <Icon name="arrow-right" />
        </ButtonLink>
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <li key={service.slug}>
            <Reveal delay={(index % 3) * 80} className="h-full">
              <Link
                href={serviceHref(service.slug)}
                className="group flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card transition-colors hover:border-ink"
              >
                <span aria-hidden="true" className="mb-5 block h-1 w-10 bg-brand transition-all duration-200 group-hover:w-16" />
                <h3 className="text-xl">{service.title}</h3>
                <p className="mt-2 grow text-muted">{service.shortDescription}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-strong">
                  Meer over {service.navTitle.toLowerCase().replace("velux", "VELUX")}
                  <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

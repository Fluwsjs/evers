import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getActiveServices, routes } from "@/lib/site";
import { ServiceCard } from "./ServiceCard";

/** Alle actieve diensten als kaarten, voor de homepage. */
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
              <ServiceCard service={service} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

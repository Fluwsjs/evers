import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Foutcode 404"
        title="Deze pagina bestaat niet (meer)"
        intro="De link is mogelijk verouderd of verkeerd getypt. Via onderstaande knoppen vindt u snel de weg terug."
      />
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={routes.home}>Naar de homepage</ButtonLink>
        <ButtonLink href={routes.services} variant="outline">
          Bekijk onze diensten
        </ButtonLink>
      </div>
    </Section>
  );
}

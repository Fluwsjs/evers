import type { FaqItem } from "@content/faq";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { routes } from "@/lib/site";

interface FaqListProps {
  items: FaqItem[];
  /** Kopniveau van de vragen: h3 onder een h2-sectiekop. */
  headingLevel?: "h2" | "h3";
}

/**
 * Accordeon op basis van <details>: werkt zonder JavaScript, is met het toetsenbord
 * te bedienen en de antwoorden zijn vindbaar met zoeken-in-pagina.
 */
export function FaqList({ items, headingLevel: Heading = "h3" }: FaqListProps) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <Heading className="font-sans text-lg font-semibold tracking-normal">{item.question}</Heading>
            <Icon
              name="chevron-down"
              className="text-brand-strong transition-transform duration-150 group-open:rotate-180"
            />
          </summary>
          <p className="max-w-3xl pr-10 pb-5 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

/** FAQ-sectie voor de homepage. De FAQPage-structured data volgt in fase 9. */
export function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section labelledBy="faq-titel">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading
            id="faq-titel"
            eyebrow="Veelgestelde vragen"
            title="Vragen over uw dak"
            intro="Staat uw vraag er niet bij? Bel of mail ons gerust."
          />
          <div className="mt-8">
            <ButtonLink href={routes.faq} variant="outline">
              Alle vragen
              <Icon name="arrow-right" />
            </ButtonLink>
          </div>
        </div>
        <FaqList items={items} />
      </div>
    </Section>
  );
}

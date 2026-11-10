import Image from "next/image";
import { site } from "@config/site";
import type { FaqItem } from "@content/faq";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { routes } from "@/lib/site";
import { mailHref, telHref } from "@/lib/utils";

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
  const { contact, owner } = site;

  return (
    <Section labelledBy="faq-titel">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading
            id="faq-titel"
            eyebrow="Veelgestelde vragen"
            title="Vragen over uw dak"
          />
          <div className="mt-6">
            <ButtonLink href={routes.faq} variant="outline">
              Alle vragen
              <Icon name="arrow-right" />
            </ButtonLink>
          </div>

          {/* Contactkaart: wie een vraag heeft die er niet bij staat, kan direct bellen. */}
          <aside aria-labelledby="faq-contact-titel" className="mt-10 rounded-card bg-sand p-6">
            <div className="flex items-start gap-4">
              {owner.photo && owner.name ? (
                <Image
                  src={owner.photo}
                  alt={owner.name}
                  width={64}
                  height={64}
                  className="size-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-white">
                  <Icon name="chat" />
                </span>
              )}
              <div>
                <h3 id="faq-contact-titel" className="text-xl">
                  Staat uw vraag er niet bij?
                </h3>
                <p className="mt-1 text-muted">
                  {owner.name
                    ? `Bel of mail gerust. ${owner.name} denkt graag met u mee over uw dak.`
                    : "Bel of mail gerust. Wij denken graag met u mee over uw dak."}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ButtonLink href={telHref(contact.phone)} variant="dark">
                <Icon name="phone" />
                Bel {contact.phoneDisplay}
              </ButtonLink>
              <a href={mailHref(contact.email)} className="font-semibold text-brand-strong underline underline-offset-4">
                Stuur een e-mail
              </a>
            </div>
          </aside>
        </div>
        <FaqList items={items} />
      </div>
    </Section>
  );
}

import { site } from "@config/site";
import { PriceCalculator } from "@/components/calculator/PriceCalculator";
import { ButtonLink } from "@/components/ui/Button";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getPriceGroups, hasVisiblePrices } from "@/lib/pricing/price-list";
import { routes } from "@/lib/site";
import { telHref } from "@/lib/utils";

interface PriceCalculatorSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  tone?: "white" | "sand";
}

/**
 * Sectie met de prijscalculator, op de homepage en op /prijzen/.
 *
 * Staan er (nog) geen bevestigde prijzen in de config, dan valt er niets te berekenen en
 * verwijst de sectie naar het offerteformulier. De calculator verschijnt vanzelf zodra er
 * prijzen zijn.
 */
export function PriceCalculatorSection({
  id = "calculator",
  eyebrow = "Prijsindicatie",
  title = "Wat kost uw dak?",
  tone = "white",
}: PriceCalculatorSectionProps) {
  if (!site.features.calculator) return null;
  const headingId = `${id}-titel`;

  if (!hasVisiblePrices()) {
    return (
      <Section labelledBy={headingId} id={id} tone={tone}>
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          intro="Elk dak is anders: de prijs hangt af van de oppervlakte, de staat van het dak, de bereikbaarheid en de materialen die u kiest. Daarom rekenen wij het graag voor uw situatie uit."
        />
        <ul className="mt-6 space-y-3">
          {[
            "De offerte is vrijblijvend en kost u niets",
            "Met foto's van uw dak kunnen wij sneller een goede inschatting maken",
            "U krijgt een vaste prijs, na een inspectie van uw dak",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <Icon name="check" className="mt-0.5 text-brand-strong" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={routes.quote}>
            Offerte aanvragen
            <Icon name="arrow-right" />
          </ButtonLink>
          <ButtonLink href={telHref(site.contact.phone)} variant="outline">
            <Icon name="phone" />
            Bel {site.contact.phoneDisplay}
          </ButtonLink>
        </div>
        <p className="mt-6">
          <ClientTodo>vanaf-prijzen bevestigen; daarna verschijnt hier de calculator</ClientTodo>
        </p>
      </Section>
    );
  }

  return (
    <Section labelledBy={headingId} id={id} tone={tone}>
      <SectionHeading
        id={headingId}
        eyebrow={eyebrow}
        title={title}
        intro="Kies de werkzaamheden, vul de maten in en u ziet direct een indicatie inclusief btw. Een schatting van de maten is genoeg."
      />
      <div className="mt-10">
        <PriceCalculator groups={getPriceGroups()} vatRate={site.pricing.vatRate} quoteHref={routes.quote} />
      </div>
    </Section>
  );
}

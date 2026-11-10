import { Suspense } from "react";
import { site } from "@config/site";
import { photoLimits } from "@content/quote-options";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getPriceList } from "@/lib/pricing/price-list";
import { getServiceGroups, routes } from "@/lib/site";
import { telHref } from "@/lib/utils";

/**
 * Het volledige offerteformulier op de homepage, voor wie al naar beneden heeft gelezen
 * en niet terug wil naar de eerste stap bovenaan. Hetzelfde formulier als op
 * /offerte-aanvragen/, met dezelfde controle en verzending.
 */
export function QuoteSection() {
  const { contact } = site;
  const groups = getServiceGroups().map((group) => ({
    title: group.category.title,
    services: group.services.map((service) => ({ slug: service.slug, label: service.navTitle })),
  }));

  return (
    <Section tone="sand" labelledBy="offerte-sectie-titel" id="offerte-formulier">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-12">
        <div>
          <SectionHeading
            id="offerte-sectie-titel"
            eyebrow="Offerte"
            title="Vraag uw offerte aan"
            intro="Vertel ons in drie korte stappen wat er moet gebeuren. Wij nemen contact met u op en maken zo nodig een afspraak om uw dak te bekijken."
          />
          <ul className="mt-6 space-y-3">
            {[
              "Vrijblijvend: u zit nergens aan vast",
              `Stuur tot ${photoLimits.maxFiles} foto's van uw dak mee`,
              "U ontvangt een bevestiging per e-mail",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Icon name="check" className="mt-0.5 text-brand-strong" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-semibold">Liever even bellen?</p>
          <p>
            <a
              href={telHref(contact.phone)}
              className="inline-flex min-h-11 items-center gap-3 font-display text-2xl font-extrabold underline-offset-4 hover:underline"
            >
              <Icon name="phone" className="text-brand-strong" />
              {contact.phoneDisplay}
            </a>
          </p>
        </div>

        <div>
          <noscript>
            <p className="rounded-card border border-line bg-white p-6">
              Dit formulier werkt alleen met JavaScript. Bel ons op{" "}
              <a href={telHref(contact.phone)} className="font-semibold underline">
                {contact.phoneDisplay}
              </a>
              .
            </p>
          </noscript>
          {/* useSearchParams vraagt om een Suspense-grens; de pagina zelf blijft statisch. */}
          <Suspense fallback={<div className="min-h-96 rounded-card border border-line bg-white" aria-hidden="true" />}>
            <QuoteForm
              groups={groups}
              priceList={getPriceList()}
              vatRate={site.pricing.vatRate}
              privacyHref={routes.privacy}
              thanksHref={routes.thanks}
              phone={{ href: telHref(contact.phone), display: contact.phoneDisplay }}
              headingLevel="h3"
            />
          </Suspense>
        </div>
      </div>
    </Section>
  );
}

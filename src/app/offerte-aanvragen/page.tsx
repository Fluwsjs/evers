import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@config/site";
import { photoLimits } from "@content/quote-options";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getPriceList } from "@/lib/pricing/price-list";
import { getServiceGroups, routes } from "@/lib/site";
import { telHref, whatsappHref } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/offerte-aanvragen/",
  title: "Offerte aanvragen",
  description: `Vraag in drie stappen een vrijblijvende offerte aan bij ${site.name}. Stuur foto's van uw dak mee voor een snelle en goede inschatting.`,
});

export default function QuotePage() {
  const { contact, features } = site;
  const groups = getServiceGroups().map((group) => ({
    title: group.category.title,
    services: group.services.map((service) => ({ slug: service.slug, label: service.navTitle })),
  }));

  return (
    <>
      <Breadcrumbs items={[{ label: "Offerte aanvragen" }]} />

      <section aria-labelledby="offerte-titel" className="bg-sand py-10 md:py-14">
        <Container className="grid gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-12">
          <div>
            <h1 id="offerte-titel" className="text-3xl sm:text-4xl md:text-5xl">
              Vrijblijvende offerte aanvragen
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Vertel ons in drie korte stappen wat er moet gebeuren. Wij nemen contact met u op en maken zo nodig een
              afspraak om uw dak te bekijken.
            </p>

            <div className="mt-8">
              <noscript>
                <p className="rounded-card border border-line bg-white p-6">
                  Dit formulier werkt alleen met JavaScript. Bel ons op{" "}
                  <a href={telHref(contact.phone)} className="font-semibold underline">
                    {contact.phoneDisplay}
                  </a>{" "}
                  of mail naar{" "}
                  <a href={`mailto:${contact.email}`} className="font-semibold underline">
                    {contact.email}
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
                />
              </Suspense>
            </div>
          </div>

          <aside aria-label="Goed om te weten" className="space-y-6 lg:pt-2">
            <div className="rounded-card bg-white p-6 shadow-card">
              <h2 className="text-xl">Goed om te weten</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "De offerte is vrijblijvend: u zit nergens aan vast.",
                  `U kunt maximaal ${photoLimits.maxFiles} foto's meesturen. Dat helpt ons om uw aanvraag goed in te schatten.`,
                  "U ontvangt een bevestiging per e-mail met een referentienummer.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Icon name="check" className="mt-0.5 text-brand-strong" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="on-dark rounded-card bg-ink p-6 text-on-dark">
              <h2 className="text-xl text-white">Liever direct contact?</h2>
              <p className="mt-2 text-on-dark-muted">Bij spoed kunt u het beste even bellen.</p>
              <p className="mt-4">
                <a
                  href={telHref(contact.phone)}
                  className="inline-flex min-h-11 items-center gap-3 font-display text-2xl font-extrabold text-white underline-offset-4 hover:underline"
                >
                  <Icon name="phone" className="text-brand" />
                  {contact.phoneDisplay}
                </a>
              </p>
              {features.whatsapp && contact.whatsapp ? (
                <p>
                  <a
                    href={whatsappHref(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-3 font-semibold text-white underline-offset-4 hover:underline"
                  >
                    <Icon name="chat" className="text-brand" />
                    Stuur een WhatsApp-bericht
                    <span className="sr-only"> (opent in een nieuw tabblad)</span>
                  </a>
                </p>
              ) : null}
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

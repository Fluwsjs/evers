import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@config/site";
import { generalFaq } from "@content/faq";
import { getServiceDetail } from "@content/services";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqAccordion";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { getActiveServices, serviceHref } from "@/lib/site";
import { inSentence } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Veelgestelde vragen over dakwerk",
  description: `Antwoorden op veelgestelde vragen over dakrenovatie, platte daken, schoorstenen, lood- en zinkwerk en dakramen, en over werken met ${site.shortName}.`,
};

/** Alle vragen op één pagina: eerst de algemene, daarna per dienst. De FAQPage-structured data volgt in fase 9. */
export default function FaqPage() {
  const groups = getActiveServices().map((service) => ({
    service,
    items: getServiceDetail(service.slug).faq,
  }));

  return (
    <>
      <Breadcrumbs items={[{ label: "Veelgestelde vragen" }]} />
      <PageHeader
        title="Veelgestelde vragen"
        intro="Hier vindt u antwoorden op vragen die vaak gesteld worden. Eerst de algemene vragen, daarna per soort werk."
      >
        <nav aria-label="Onderwerpen op deze pagina" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            <li>
              <a href="#algemeen" className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 font-semibold hover:border-ink">
                Algemeen
              </a>
            </li>
            {groups.map(({ service }) => (
              <li key={service.slug}>
                <a
                  href={`#${service.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 font-semibold hover:border-ink"
                >
                  {service.navTitle}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="py-12 md:py-16">
        <Container className="max-w-4xl space-y-14">
          <section id="algemeen" aria-labelledby="algemeen-titel" className="scroll-mt-28">
            <h2 id="algemeen-titel" className="mb-6 text-2xl md:text-3xl">
              Algemeen
            </h2>
            <FaqList items={generalFaq} />
          </section>

          {groups.map(({ service, items }) => (
            <section key={service.slug} id={service.slug} aria-labelledby={`${service.slug}-titel`} className="scroll-mt-28">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 id={`${service.slug}-titel`} className="text-2xl md:text-3xl">
                  {service.title}
                </h2>
                <Link
                  href={serviceHref(service.slug)}
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-strong underline-offset-4 hover:underline"
                >
                  Meer over {inSentence(service.navTitle)}
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </div>
              <FaqList items={items} />
            </section>
          ))}
        </Container>
      </div>

      <CtaBand
        title="Staat uw vraag er niet bij?"
        text="Bel of stuur een bericht. Wij denken graag met u mee, ook als u nog niet weet of er iets moet gebeuren."
        buttonLabel="Offerte aanvragen"
      />
    </>
  );
}

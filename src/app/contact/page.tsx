import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { site } from "@config/site";
import { CallbackForm } from "@/components/forms/CallbackForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { FormNotice } from "@/components/forms/FormNotice";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AreaMap } from "@/components/sections/AreaMap";
import { ButtonLink } from "@/components/ui/Button";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { getActivePlaces, routes } from "@/lib/site";
import { mailHref, telHref, whatsappHref } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contact/",
  title: "Contact",
  description: `Neem contact op met ${site.name}: bel ${site.contact.phoneDisplay}, stuur een bericht of laat u terugbellen. Bij spoed kunt u het beste direct bellen.`,
});

export default function ContactPage() {
  const { address, contact, emergency, features, openingHours, registration } = site;
  const phone = { href: telHref(contact.phone), display: contact.phoneDisplay };
  const places = getActivePlaces();

  return (
    <>
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <PageHeader
        title={`Contact met ${site.shortName}`}
        intro="Heeft u een vraag over uw dak of wilt u een afspraak maken? Bel, stuur een bericht of laat u terugbellen."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={phone.href} size="lg">
            <Icon name="phone" />
            Bel {phone.display}
          </ButtonLink>
          <ButtonLink href={routes.quote} variant="outline" size="lg">
            Offerte aanvragen
            <Icon name="arrow-right" />
          </ButtonLink>
        </div>
      </PageHeader>

      <section aria-label="Contactgegevens en formulier" className="py-12 md:py-16">
        <Container>
          <Suspense fallback={null}>
            <FormNotice phone={phone} />
          </Suspense>

          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            {/* Gegevens */}
            <div>
              <h2 className="text-2xl md:text-3xl">Contactgegevens</h2>
              <address className="mt-6 space-y-5 not-italic">
                <p className="flex gap-4">
                  <Icon name="phone" className="mt-1 text-brand-strong" />
                  <span>
                    <span className="block text-sm text-muted">Telefoon{emergency.enabled ? " (ook bij spoed)" : ""}</span>
                    {/* Het echte nummer uit de config. Op de oude site stond hier tel:0123456789. */}
                    <a href={phone.href} className="font-display text-2xl font-extrabold underline-offset-4 hover:underline">
                      {phone.display}
                    </a>
                  </span>
                </p>
                <p className="flex gap-4">
                  <Icon name="mail" className="mt-1 text-brand-strong" />
                  <span>
                    <span className="block text-sm text-muted">E-mail</span>
                    <a href={mailHref(contact.email)} className="font-semibold wrap-anywhere underline underline-offset-4">
                      {contact.email}
                    </a>
                  </span>
                </p>
                {features.whatsapp && contact.whatsapp ? (
                  <p className="flex gap-4">
                    <Icon name="chat" className="mt-1 text-brand-strong" />
                    <span>
                      <span className="block text-sm text-muted">WhatsApp</span>
                      <a
                        href={whatsappHref(contact.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline underline-offset-4"
                      >
                        Stuur een bericht
                        <span className="sr-only"> (opent in een nieuw tabblad)</span>
                      </a>
                    </span>
                  </p>
                ) : null}
                <p className="flex gap-4">
                  <Icon name="pin" className="mt-1 text-brand-strong" />
                  <span>
                    <span className="block text-sm text-muted">Adres</span>
                    {address.confirmed && address.street && address.city ? (
                      <span className="font-semibold">
                        {address.street}
                        <br />
                        {[address.postalCode, address.city].filter(Boolean).join(" ")}
                      </span>
                    ) : (
                      <ClientTodo>adres bevestigen</ClientTodo>
                    )}
                  </span>
                </p>
              </address>

              <h2 className="mt-10 text-xl">Openingstijden</h2>
              {openingHours ? (
                <dl className="mt-3 grid max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-1.5">
                  {openingHours.map((entry) => (
                    <div key={entry.label} className="contents">
                      <dt>{entry.label}</dt>
                      <dd className="font-semibold">
                        {entry.opens && entry.closes ? `${entry.opens} – ${entry.closes}` : "Gesloten"}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3">
                  <ClientTodo>openingstijden</ClientTodo>
                </p>
              )}

              <h2 className="mt-10 text-xl">Bedrijfsgegevens</h2>
              <dl className="mt-3 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
                <dt className="text-muted">Naam</dt>
                <dd>{site.legalName ?? site.name}</dd>
                <dt className="text-muted">KvK</dt>
                <dd>{registration.kvk ?? <ClientTodo>KvK-nummer</ClientTodo>}</dd>
                <dt className="text-muted">Btw</dt>
                <dd>{registration.vat ?? <ClientTodo>btw-nummer</ClientTodo>}</dd>
              </dl>
            </div>

            {/* Formulier */}
            <div className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-2xl md:text-3xl">Stuur een bericht</h2>
              <p className="mt-2 mb-6 text-muted">
                Voor een offerte kunt u beter het{" "}
                <Link href={routes.quote} className="font-semibold text-brand-strong underline">
                  offerteformulier
                </Link>{" "}
                gebruiken: daar kunt u ook foto&apos;s meesturen.
              </p>
              <ContactForm privacyHref={routes.privacy} thanksHref={routes.thanks} />
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="terugbellen-titel" className="bg-sand py-12 md:py-16">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="terugbellen-titel" className="text-2xl md:text-3xl">
              Liever teruggebeld worden?
            </h2>
            <p className="mt-3 max-w-md text-lg text-muted">
              Laat uw naam en nummer achter en kies een moment. Wij bellen u terug.
            </p>
            <div className="mt-6 max-w-md rounded-card bg-white p-6 shadow-card">
              <CallbackForm privacyHref={routes.privacy} thanksHref={routes.thanks} idPrefix="contact-terugbel" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl">Waar wij werken</h2>
            <p className="mt-3 mb-6 text-lg text-muted">
              Wij komen naar u toe. Bekijk het{" "}
              <Link href={routes.serviceArea} className="font-semibold text-brand-strong underline">
                werkgebied
              </Link>{" "}
              voor de plaatsen waar wij werken.
            </p>
            <AreaMap places={places} />
          </div>
        </Container>
      </section>
    </>
  );
}

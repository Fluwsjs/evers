import Image from "next/image";
import { site } from "@config/site";
import { images } from "@content/images.generated";
import { CallbackForm } from "@/components/forms/CallbackForm";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { routes } from "@/lib/site";
import { telHref, whatsappHref } from "@/lib/utils";

/**
 * Afsluitende oproep op de homepage.
 * Links bellen of WhatsApp, rechts het terugbelformulier.
 */
export function CallbackSection() {
  const { contact, features } = site;
  const photo = images.dakdekkerOpLeienDak;

  return (
    <section aria-labelledby="terugbel-titel" className="on-dark relative isolate overflow-hidden bg-ink text-on-dark">
      <Image
        src={photo.src}
        alt=""
        width={photo.width}
        height={photo.height}
        placeholder="blur"
        blurDataURL={photo.blurDataURL}
        sizes="100vw"
        className="absolute inset-0 -z-10 size-full object-cover opacity-25"
      />
      <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="mb-3 flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-on-dark-muted uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-brand" />
            Vrijblijvend
          </p>
          <h2 id="terugbel-titel" className="text-3xl text-white md:text-4xl">
            Liever eerst even overleggen?
          </h2>
          <p className="mt-4 max-w-xl text-lg text-on-dark-muted">
            Bel ons of stuur een bericht. We bespreken uw situatie en plannen als u dat wilt een afspraak om uw dak te
            bekijken.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={telHref(contact.phone)} size="lg">
              <Icon name="phone" />
              Bel {contact.phoneDisplay}
            </ButtonLink>
            {features.whatsapp && contact.whatsapp ? (
              <ButtonLink href={whatsappHref(contact.whatsapp)} variant="outline-on-dark" size="lg">
                <Icon name="chat" />
                WhatsApp
                <span className="sr-only">(opent in een nieuw tabblad)</span>
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <div className="rounded-card bg-white p-6 text-ink shadow-card sm:p-8">
          <h3 className="text-2xl">Wij bellen u terug</h3>
          <p className="mt-2 mb-6 text-muted">
            Laat uw naam en telefoonnummer achter en kies wanneer het u uitkomt.
          </p>
          <CallbackForm privacyHref={routes.privacy} thanksHref={routes.thanks} />
        </div>
      </Container>
    </section>
  );
}

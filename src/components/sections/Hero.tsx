import Image from "next/image";
import { site } from "@config/site";
import { images } from "@content/images.generated";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GoogleScore } from "@/components/ui/GoogleScore";
import { Icon } from "@/components/ui/Icon";
import { telHref } from "@/lib/utils";
import { QuoteStarter } from "./QuoteStarter";

export const QUOTE_START_ID = "offerte";

/**
 * Hero van de homepage: belofte, USP's, twee CTA's en een echte werkfoto,
 * met direct daaronder stap 1 van het offerteformulier.
 */
export function Hero() {
  const { contact, serviceArea, usps } = site;
  const photo = images.heroDakpannenLeggen;
  const region = serviceArea.regionLabel ? ` in ${serviceArea.regionLabel}` : "";

  return (
    <section aria-labelledby="hero-titel" className="bg-sand">
      <Container className="grid gap-10 pt-10 pb-12 md:pt-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:pb-28">
        <div>
          <p className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-muted uppercase">
            <span aria-hidden="true" className="h-0.5 w-8 bg-brand" />
            {site.shortName}
          </p>
          <h1 id="hero-titel" className="text-4xl sm:text-5xl lg:text-6xl">
            Dakdekker{region} voor dakrenovatie en nieuwbouw
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Van een nieuw pannendak tot lood- en zinkwerk. Wij komen bij u kijken, leggen uit wat nodig is en maken
            een duidelijke offerte.
          </p>

          <ul className="mt-7 grid max-w-xl gap-x-8 gap-y-2 sm:grid-cols-2">
            {usps.map((usp) => (
              <li key={usp} className="flex items-center gap-3 font-medium">
                <Icon name="check" className="text-brand-strong" />
                {usp}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`#${QUOTE_START_ID}`} size="lg">
              Offerte aanvragen
              <Icon name="arrow-right" />
            </ButtonLink>
            <ButtonLink href={telHref(contact.phone)} variant="outline" size="lg">
              <Icon name="phone" />
              Bel {contact.phoneDisplay}
            </ButtonLink>
          </div>

          <GoogleScore className="mt-6 font-medium" />
        </div>

        <div className="relative">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            priority
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="aspect-4/3 w-full rounded-card object-cover object-[50%_65%] lg:aspect-4/5"
          />
          {/* Oranje daklijn als verwijzing naar het logo */}
          <span aria-hidden="true" className="absolute -bottom-3 -left-3 -z-0 hidden h-24 w-24 rounded-bl-card border-b-4 border-l-4 border-brand lg:block" />
        </div>
      </Container>

      <div id={QUOTE_START_ID} className="scroll-mt-28 bg-linear-to-b from-sand from-50% to-white to-50%">
        <Container className="lg:-mt-16">
          <QuoteStarter />
        </Container>
      </div>
    </section>
  );
}

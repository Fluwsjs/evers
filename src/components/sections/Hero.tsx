import Image from "next/image";
import { site } from "@config/site";
import { images } from "@content/images.generated";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GoogleScore } from "@/components/ui/GoogleScore";
import { Icon } from "@/components/ui/Icon";
import { isCalculatorVisible } from "@/lib/pricing/price-list";
import { routes } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { QuoteStarter } from "./QuoteStarter";

export const QUOTE_START_ID = "offerte";

/**
 * Hero van de homepage: een echte werkfoto over de volle breedte, met links de belofte,
 * de pluspunten en twee knoppen, en rechts stap 1 van het offerteformulier als kaart.
 *
 * De foto is hier achtergrond (lege alt); een donker verloop eroverheen houdt de tekst
 * leesbaar, ook waar de foto licht is.
 *
 * Op mobiel blijft de kaart weg: de hero zou anders ruim twee schermen hoog zijn, en de
 * knop hier en de vaste actiebalk onderaan leiden al naar het offerteformulier.
 */
export function Hero() {
  const { contact, serviceArea, usps } = site;
  const photo = images.heroDakpannenLeggen;
  const region = serviceArea.regionLabel ? ` in ${serviceArea.regionLabel}` : "";
  const calculator = isCalculatorVisible();

  return (
    <section aria-labelledby="hero-titel" className="on-dark relative isolate overflow-hidden bg-ink text-on-dark">
      <Image
        src={photo.src}
        alt=""
        width={photo.width}
        height={photo.height}
        priority
        placeholder="blur"
        blurDataURL={photo.blurDataURL}
        sizes="100vw"
        className="absolute inset-0 -z-20 size-full object-cover object-[50%_60%]"
      />
      {/* Donker verloop: links bijna dicht voor de tekst, rechts open zodat de foto zichtbaar blijft. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-ink/80 lg:bg-transparent lg:bg-linear-to-r lg:from-ink/95 lg:from-20% lg:via-ink/70 lg:via-55% lg:to-ink/20"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-ink/70 to-transparent" />

      {/* Onderaan extra ruimte: de merkenkaart van de volgende sectie valt over de onderrand heen. */}
      <Container className="grid gap-10 pt-12 pb-24 md:pt-16 md:pb-28 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_32rem] xl:gap-20">
        <div>
          <h1
            id="hero-titel"
            className="text-[2.6rem] leading-[1.02] text-white sm:text-6xl lg:text-[3.25rem] xl:text-[4.25rem]"
          >
            Dakdekker{region} voor dakrenovatie <span className="text-brand">en nieuwbouw</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-on-dark xl:text-xl">
            Van een nieuw pannendak tot lood- en zinkwerk. Wij komen bij u kijken, leggen uit wat nodig is en maken
            een duidelijke offerte.
          </p>

          <ul className="mt-8 grid max-w-xl gap-x-8 gap-y-4 sm:grid-cols-2">
            {usps.map((usp) => (
              <li key={usp.text} className="flex items-center gap-3 font-semibold text-white">
                <Icon name={usp.icon} className="size-6 text-brand" />
                {usp.text}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={telHref(contact.phone)} size="lg">
              <Icon name="phone" />
              Bel {contact.phoneDisplay}
            </ButtonLink>
            {/* Mobiel: naar het formulier. Tablet: naar de kaart hieronder. Desktop: de kaart staat ernaast. */}
            <ButtonLink href={routes.quote} variant="outline-on-dark" size="lg" className="md:hidden">
              Offerte aanvragen
              <Icon name="arrow-right" />
            </ButtonLink>
            <ButtonLink href={`#${QUOTE_START_ID}`} variant="outline-on-dark" size="lg" className="max-md:hidden lg:hidden">
              Offerte aanvragen
              <Icon name="arrow-right" />
            </ButtonLink>
            {/* Desktop: een tweede route naast de kaart. Zonder prijzen is er geen calculator. */}
            {calculator ? (
              <ButtonLink href="#calculator" variant="outline-on-dark" size="lg" className="max-lg:hidden">
                <Icon name="document" />
                Bereken uw prijs
              </ButtonLink>
            ) : (
              <ButtonLink href={routes.projects} variant="outline-on-dark" size="lg" className="max-lg:hidden">
                Bekijk ons werk
                <Icon name="arrow-right" />
              </ButtonLink>
            )}
          </div>

          <GoogleScore className="mt-7 font-medium text-white" />
        </div>

        <div id={QUOTE_START_ID} className="scroll-mt-28 max-md:hidden">
          <QuoteStarter />
        </div>
      </Container>
    </section>
  );
}

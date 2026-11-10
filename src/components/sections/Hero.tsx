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
 * Hero van de homepage: een echte werkfoto over de volle breedte, met links de belofte,
 * USP's en bellen, en rechts stap 1 van het offerteformulier als kaart.
 *
 * De foto is hier achtergrond (lege alt); een donker verloop eroverheen houdt de tekst
 * leesbaar, ook waar de foto licht is.
 */
export function Hero() {
  const { contact, serviceArea, usps } = site;
  const photo = images.heroDakpannenLeggen;
  const region = serviceArea.regionLabel ? ` in ${serviceArea.regionLabel}` : "";

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
      {/* Donker verloop: links bijna dicht voor de tekst, rechts opener zodat de foto zichtbaar blijft. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-ink/80 lg:bg-transparent lg:bg-linear-to-r lg:from-ink/95 lg:from-15% lg:via-ink/75 lg:via-50% lg:to-ink/35"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-ink/70 to-transparent" />

      <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:py-14 xl:gap-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold tracking-wide text-ink uppercase">
              Dakdekker
            </span>
            {site.shortName}
          </p>
          <h1 id="hero-titel" className="text-4xl text-white sm:text-5xl xl:text-6xl">
            Dakdekker{region} voor dakrenovatie <span className="text-brand">en nieuwbouw</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-on-dark">
            Van een nieuw pannendak tot lood- en zinkwerk. Wij komen bij u kijken, leggen uit wat nodig is en maken
            een duidelijke offerte.
          </p>

          <ul className="mt-8 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2">
            {usps.map((usp) => (
              <li key={usp} className="flex items-center gap-3 font-medium text-white">
                <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-ink">
                  <Icon name="check" className="size-4" />
                </span>
                {usp}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={telHref(contact.phone)} size="lg">
              <Icon name="phone" />
              Bel {contact.phoneDisplay}
            </ButtonLink>
            <ButtonLink href={`#${QUOTE_START_ID}`} variant="outline-on-dark" size="lg" className="lg:hidden">
              Offerte aanvragen
              <Icon name="arrow-right" />
            </ButtonLink>
          </div>

          <GoogleScore className="mt-6 font-medium text-white" />
        </div>

        <div id={QUOTE_START_ID} className="scroll-mt-28">
          <QuoteStarter />
        </div>
      </Container>
    </section>
  );
}

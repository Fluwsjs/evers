import { site } from "@config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { quoteHref } from "@/lib/site";
import { telHref } from "@/lib/utils";

interface CtaBandProps {
  id?: string;
  title: string;
  text: string;
  /** Selecteert deze dienst alvast in het offerteformulier. */
  serviceSlug?: string;
  buttonLabel?: string;
}

/** Donkere band met een oproep tot actie: offerte aanvragen of bellen. */
export function CtaBand({ id = "cta-titel", title, text, serviceSlug, buttonLabel = "Offerte aanvragen" }: CtaBandProps) {
  return (
    <section aria-labelledby={id} className="on-dark bg-ink py-14 text-on-dark md:py-20">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl border-l-4 border-brand pl-6">
          <h2 id={id} className="text-3xl text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-lg text-on-dark-muted">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={quoteHref(serviceSlug)} size="lg">
            {buttonLabel}
            <Icon name="arrow-right" />
          </ButtonLink>
          <ButtonLink href={telHref(site.contact.phone)} variant="outline-on-dark" size="lg">
            <Icon name="phone" />
            {site.contact.phoneDisplay}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

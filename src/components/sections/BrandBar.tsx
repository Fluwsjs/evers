import Image from "next/image";
import { site } from "@config/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const eyebrowClasses = "flex items-center gap-3 text-xs font-semibold tracking-[0.14em] text-muted uppercase";

/**
 * Merken waarmee gewerkt wordt, plus certificeringen, als witte kaart die over de
 * onderrand van de hero valt.
 *
 * Een merk zonder logo-bestand wordt als naam getoond; logo's van fabrikanten
 * gebruiken we alleen als de klant ze met toestemming aanlevert.
 */
export function BrandBar() {
  const { brands, certifications } = site;
  if (brands.length === 0 && certifications.length === 0) return null;

  return (
    <section aria-labelledby="merken-titel" className="bg-sand">
      <Container>
        {/* De negatieve marge trekt de kaart over de hero heen; de hero houdt daar onderaan ruimte voor vrij. */}
        <div className="relative z-10 -mt-10 flex flex-col gap-6 rounded-2xl bg-white px-6 py-6 shadow-[0_24px_50px_-28px_rgb(20_18_15/0.45)] ring-1 ring-ink/5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-7">
          {brands.length > 0 ? (
            <div className="min-w-0">
              <h2 id="merken-titel" className={`${eyebrowClasses} font-sans`}>
                <span aria-hidden="true" className="h-0.5 w-6 bg-brand" />
                Merken waarmee wij werken
              </h2>
              <ul className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-2 xl:gap-x-9">
                {brands.map((brand) => (
                  <li key={brand.name}>
                    {brand.logo ? (
                      <Image src={brand.logo} alt={brand.name} width={140} height={48} className="h-9 w-auto object-contain" />
                    ) : (
                      <span className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                        {brand.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <h2 id="merken-titel" className="sr-only">
              Certificering
            </h2>
          )}

          {certifications.length > 0 ? (
            <ul className="flex shrink-0 flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              {certifications.map((certification) => (
                <li key={certification.name} className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-strong"
                  >
                    <Icon name="badge" className="size-6" />
                  </span>
                  <span>
                    <span className={eyebrowClasses}>Certificering</span>
                    <span className="mt-0.5 block font-display text-lg leading-tight font-extrabold sm:text-xl">
                      {certification.name}-gecertificeerd
                    </span>
                    {certification.description ? (
                      <span className="block text-sm text-muted">{certification.description}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

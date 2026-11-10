import Image from "next/image";
import { site } from "@config/site";
import { Container } from "@/components/ui/Container";

/**
 * Merken waarmee gewerkt wordt, plus certificeringen.
 * Een merk zonder logo-bestand wordt als naam getoond; logo's van fabrikanten
 * gebruiken we alleen als de klant ze met toestemming aanlevert.
 */
export function BrandBar() {
  const { brands, certifications } = site;
  if (brands.length === 0 && certifications.length === 0) return null;

  return (
    <section aria-labelledby="merken-titel" className="border-b border-line bg-white py-10">
      <Container className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
        <h2 id="merken-titel" className="shrink-0 font-sans text-sm font-semibold tracking-normal text-muted lg:max-w-48">
          Merken waarmee wij werken en onze certificering
        </h2>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:gap-x-10">
          {brands.map((brand) => (
            <li key={brand.name}>
              {brand.logo ? (
                <Image src={brand.logo} alt={brand.name} width={140} height={48} className="h-10 w-auto object-contain" />
              ) : (
                <span className="font-display text-xl font-extrabold tracking-tight text-ink-700">{brand.name}</span>
              )}
            </li>
          ))}
          {certifications.map((certification) => (
            <li key={certification.name}>
              <span className="inline-flex items-center rounded-md border-2 border-ink px-3 py-1 font-display text-base font-extrabold">
                {certification.name}-gecertificeerd
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

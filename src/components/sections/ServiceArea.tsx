import Image from "next/image";
import Link from "next/link";
import { site } from "@config/site";
import { images } from "@content/images.generated";
import { ButtonLink } from "@/components/ui/Button";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { formatList, getActivePlaces, placeHref, routes } from "@/lib/site";

/** Werkgebied op de homepage. De kaart volgt op /werkgebied/ (fase 7). */
export function ServiceArea() {
  const places = getActivePlaces();
  if (places.length === 0) return null;

  const photo = images.dakelementenRenovatie;
  const summary =
    site.serviceArea.summary ??
    `Wij werkten onder meer in ${formatList(places.map((place) => place.name))}. Woont u ergens anders in de regio? Neem gerust contact op, dan hoort u direct of wij bij u kunnen komen.`;

  return (
    <Section tone="sand" labelledBy="werkgebied-titel">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading id="werkgebied-titel" eyebrow="Werkgebied" title="Waar wij werken" intro={<p>{summary}</p>} />
          {site.serviceArea.summary === null ? (
            <p className="mt-3">
              <ClientTodo>werkgebied en vestigingsplaats</ClientTodo>
            </p>
          ) : null}
          <ul className="mt-6 flex flex-wrap gap-3">
            {places.map((place) => (
              <li key={place.slug}>
                <Link
                  href={placeHref(place.slug)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 font-semibold hover:border-ink"
                >
                  <Icon name="pin" className="size-4 text-brand-strong" />
                  Dakdekker {place.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href={routes.serviceArea} variant="outline">
              Bekijk het werkgebied
              <Icon name="arrow-right" />
            </ButtonLink>
          </div>
        </div>

        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          sizes="(min-width: 1024px) 36rem, 100vw"
          className="aspect-4/3 w-full rounded-card object-cover"
        />
      </div>
    </Section>
  );
}

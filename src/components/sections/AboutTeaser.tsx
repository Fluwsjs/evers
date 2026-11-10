import Image from "next/image";
import { site } from "@config/site";
import { images } from "@content/images.generated";
import { ButtonLink } from "@/components/ui/Button";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { routes } from "@/lib/site";

/** Korte kennismaking op de homepage, met foto en naam van de eigenaar zodra die bekend zijn. */
export function AboutTeaser() {
  const { owner, shortName, warranty } = site;
  const photo = images.dakdekkerZinkwerk;

  return (
    <Section labelledBy="over-ons-titel">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <Image
            src={owner.photo ?? photo.src}
            alt={owner.photo && owner.name ? `${owner.name}, ${owner.role ?? "eigenaar"} van ${shortName}` : photo.alt}
            width={photo.width}
            height={photo.height}
            placeholder={owner.photo ? "empty" : "blur"}
            blurDataURL={owner.photo ? undefined : photo.blurDataURL}
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="aspect-4/3 w-full rounded-card object-cover lg:aspect-4/5"
          />
          <div className="absolute right-4 bottom-4 left-4 rounded-lg bg-white/95 px-4 py-3 shadow-card sm:right-auto">
            {owner.name ? (
              <>
                <p className="font-display text-lg font-extrabold">{owner.name}</p>
                {owner.role ? <p className="text-sm text-muted">{owner.role}</p> : null}
              </>
            ) : (
              <>
                <p className="font-display text-lg font-extrabold">{shortName}</p>
                <ClientTodo>naam, functie en foto eigenaar</ClientTodo>
              </>
            )}
          </div>
        </Reveal>

        <div>
          <SectionHeading
            id="over-ons-titel"
            eyebrow={`Over ${shortName}`}
            title="Dakwerk dat klopt tot in de details"
            intro={
              <p>
                Een dak is zo goed als zijn aansluitingen: de kilgoot, het lood rond de schoorsteen, de overgang naar
                een dakkapel. Daar letten wij op, bij een renovatie net zo goed als in de nieuwbouw.
              </p>
            }
          />
          <ul className="mt-6 space-y-3">
            {[
              "Hellende en platte daken, schoorstenen, lood- en zinkwerk, timmerwerk en dakramen",
              "VCA-gecertificeerd: wij werken aantoonbaar veilig",
              warranty.summary,
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Icon name="check" className="mt-0.5 text-brand-strong" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href={routes.about} variant="outline">
              Meer over ons
              <Icon name="arrow-right" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

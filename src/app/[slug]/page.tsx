import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@config/site";
import { projects } from "@content/projects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getActivePlaces, getActiveServices, placeHref, routes } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

/**
 * Plaatsnaampagina's: /dakdekker-[plaats]/.
 *
 * Next.js kent geen dynamisch segment met een vast voorvoegsel, daarom is dit een
 * [slug]-route op het hoogste niveau die alleen "dakdekker-<plaats>" genereert voor de
 * plaatsen uit de config. Alle andere onbekende URL's geven gewoon een 404.
 */
const PREFIX = "dakdekker-";

export const dynamicParams = false;

export function generateStaticParams() {
  return getActivePlaces().map((place) => ({ slug: `${PREFIX}${place.slug}` }));
}

function findPlace(slug: string) {
  if (!slug.startsWith(PREFIX)) return undefined;
  return getActivePlaces().find((place) => place.slug === slug.slice(PREFIX.length));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const place = findPlace((await params).slug);
  if (!place) return {};
  return pageMetadata({
    path: placeHref(place.slug),
    title: `Dakdekker ${place.name}`,
    description: place.metaDescription,
    image: `plaats-${place.slug}`,
  });
}

export default async function PlacePage({ params }: PageProps) {
  const place = findPlace((await params).slug);
  if (!place) notFound();

  const localProjects = projects.filter((project) => project.placeSlug === place.slug);
  const services = getActiveServices();
  const otherPlaces = getActivePlaces().filter((item) => item.slug !== place.slug);

  return (
    <>
      <Breadcrumbs items={[{ label: "Werkgebied", href: routes.serviceArea }, { label: place.name }]} />
      <PageHeader title={`Dakdekker in ${place.name}`} intro={<p>{place.intro}</p>}>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={routes.quote} size="lg">
            Offerte aanvragen
            <Icon name="arrow-right" />
          </ButtonLink>
          <ButtonLink href={telHref(site.contact.phone)} variant="outline" size="lg">
            <Icon name="phone" />
            Bel {site.contact.phoneDisplay}
          </ButtonLink>
        </div>
      </PageHeader>

      {/* Werk in deze plaats */}
      {localProjects.length > 0 ? (
        <Section labelledBy="lokaal-werk-titel">
          <SectionHeading
            id="lokaal-werk-titel"
            eyebrow={`Ons werk in ${place.name}`}
            title={localProjects.length === 1 ? "Een project bij u in de buurt" : "Projecten bij u in de buurt"}
          />
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localProjects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Lokale informatie */}
      <Section tone="sand" labelledBy="lokaal-titel">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionHeading id="lokaal-titel" eyebrow={place.name} title={place.local.title} />
            <div className="mt-6 space-y-4 text-lg text-muted">
              {place.local.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl">Waar u op kunt letten</h2>
            <ul className="mt-5 space-y-4">
              {place.tips.map((tip) => (
                <Card as="li" key={tip.title} className="p-5">
                  <h3 className="text-lg">{tip.title}</h3>
                  <p className="mt-1.5 text-muted">{tip.text}</p>
                </Card>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Diensten */}
      <Section labelledBy="diensten-titel">
        <SectionHeading
          id="diensten-titel"
          eyebrow="Diensten"
          title={`Wat wij in ${place.name} voor u doen`}
          intro="Elke dienst heeft een eigen pagina met uitleg over werkwijze en materialen."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title={`Een dakdekker nodig in ${place.name}?`}
        text="Vertel ons wat er moet gebeuren en stuur gerust foto's mee. U ontvangt een vrijblijvende offerte."
      />

      {otherPlaces.length > 0 ? (
        <Section tone="sand" labelledBy="andere-plaatsen-titel">
          <h2 id="andere-plaatsen-titel" className="text-2xl">
            Wij werkten ook in
          </h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {otherPlaces.map((other) => (
              <li key={other.slug}>
                <Link
                  href={placeHref(other.slug)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 font-semibold hover:border-ink"
                >
                  <Icon name="pin" className="size-4 text-brand-strong" />
                  Dakdekker {other.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={routes.serviceArea}
                className="inline-flex min-h-11 items-center gap-2 px-2 font-semibold text-brand-strong underline-offset-4 hover:underline"
              >
                Hele werkgebied
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </li>
          </ul>
        </Section>
      ) : null}
    </>
  );
}

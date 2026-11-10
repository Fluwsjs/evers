import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@config/site";
import { images } from "@content/images.generated";
import { projects } from "@content/projects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BeforeAfterSlider } from "@/components/sections/BeforeAfterSlider";
import { CtaBand } from "@/components/sections/CtaBand";
import { Gallery } from "@/components/sections/Gallery";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getActivePlaces, getService, placeHref, routes, serviceHref } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title}: project`,
    description: `${project.summary} Bekijk de foto's van dit project van ${site.shortName}.`,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const cover = images[project.cover];
  const photos = project.images.map((key) => images[key]);
  const services = project.serviceSlugs.map((serviceSlug) => getService(serviceSlug)).filter((item) => item !== undefined);
  const hasPlacePage = project.placeSlug !== null && getActivePlaces().some((place) => place.slug === project.placeSlug);
  const beforeAfter = site.features.beforeAfter ? project.beforeAfter : undefined;

  // Eerst projecten van hetzelfde type, daarna de rest.
  const related = projects
    .filter((item) => item.slug !== project.slug)
    .sort((a, b) => Number(b.type === project.type) - Number(a.type === project.type))
    .slice(0, 3);

  const facts: Array<{ label: string; value: string }> = [
    { label: "Soort werk", value: project.type },
    ...(project.year ? [{ label: "Jaar", value: String(project.year) }] : []),
    ...(project.duration ? [{ label: "Duur", value: project.duration }] : []),
  ];
  const hasDetails = project.description !== null || project.workDone.length > 0 || project.materials.length > 0;

  return (
    <>
      <Breadcrumbs items={[{ label: "Projecten", href: routes.projects }, { label: project.title }]} />

      {/* Kop */}
      <section aria-labelledby="project-titel" className="bg-sand">
        <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <Badge tone="dark">{project.type}</Badge>
            <h1 id="project-titel" className="mt-4 text-3xl sm:text-4xl md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 text-lg text-muted">{project.summary}</p>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6">
              <div>
                <dt className="text-sm text-muted">Plaats</dt>
                <dd className="mt-1 font-semibold">
                  {hasPlacePage && project.placeSlug ? (
                    <Link href={placeHref(project.placeSlug)} className="underline underline-offset-4 hover:text-brand-strong">
                      {project.place}
                    </Link>
                  ) : (
                    project.place
                  )}
                </dd>
              </div>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-muted">{fact.label}</dt>
                  <dd className="mt-1 font-semibold">{fact.value}</dd>
                </div>
              ))}
              {services.length > 0 ? (
                <div className="col-span-2">
                  <dt className="text-sm text-muted">Diensten</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={serviceHref(service.slug)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm font-semibold hover:border-ink"
                      >
                        {service.navTitle}
                        <Icon name="arrow-right" className="size-3.5 text-brand-strong" />
                      </Link>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
            {project.year === null || project.duration === null ? (
              <p className="mt-4">
                <ClientTodo>jaar en duur van dit project</ClientTodo>
              </p>
            ) : null}
          </div>

          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            priority
            placeholder="blur"
            blurDataURL={cover.blurDataURL}
            sizes="(min-width: 1024px) 38rem, 100vw"
            className="aspect-4/3 w-full rounded-card object-cover"
          />
        </Container>
      </section>

      {/* Omschrijving, werkzaamheden en materialen: alleen als de klant ze heeft aangeleverd */}
      {hasDetails ? (
        <Section labelledBy="over-project-titel">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <SectionHeading id="over-project-titel" eyebrow="Het project" title="Wat wij hier hebben gedaan" />
              {project.description ? <p className="mt-6 max-w-2xl text-lg text-muted">{project.description}</p> : null}
              {project.workDone.length > 0 ? (
                <ul className="mt-6 space-y-3">
                  {project.workDone.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Icon name="check" className="mt-0.5 text-brand-strong" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {project.materials.length > 0 ? (
              <aside aria-labelledby="materialen-titel" className="self-start rounded-card bg-sand p-6 sm:p-8">
                <h2 id="materialen-titel" className="text-2xl">
                  Gebruikte materialen
                </h2>
                <ul className="mt-4 space-y-2">
                  {project.materials.map((material) => (
                    <li key={material} className="border-t border-line pt-2">
                      {material}
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </Section>
      ) : (
        <Container className="pt-8">
          <ClientTodo>omschrijving, uitgevoerde werkzaamheden en materialen van dit project</ClientTodo>
        </Container>
      )}

      {/* Voor/na */}
      {beforeAfter ? (
        <Section tone="sand" labelledBy="voor-na-titel">
          <SectionHeading id="voor-na-titel" eyebrow="Voor en na" title="Het verschil in één beeld" />
          <div className="mt-10 max-w-3xl">
            <BeforeAfterSlider
              before={images[beforeAfter.before]}
              after={images[beforeAfter.after]}
              caption={beforeAfter.caption}
            />
          </div>
        </Section>
      ) : null}

      {/* Foto's */}
      <Section labelledBy="fotos-titel">
        <SectionHeading
          id="fotos-titel"
          eyebrow="Foto's"
          title={`${photos.length} foto's van dit project`}
          intro="Klik op een foto om hem groot te bekijken."
        />
        <div className="mt-10">
          <Gallery photos={photos} label={`Foto's van ${project.title}`} />
        </div>
      </Section>

      <CtaBand
        title="Een vergelijkbaar project?"
        text="Vertel ons wat er moet gebeuren en stuur gerust foto's mee. U ontvangt een vrijblijvende offerte."
        serviceSlug={services[0]?.slug}
      />

      {related.length > 0 ? (
        <Section tone="sand" labelledBy="meer-projecten-titel">
          <SectionHeading id="meer-projecten-titel" eyebrow="Meer werk" title="Andere projecten" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <ProjectCard project={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

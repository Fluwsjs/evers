import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { site } from "@config/site";
import { images } from "@content/images.generated";
import { getServiceDetail } from "@content/services";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqAccordion";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getActiveServices, getProjectsForService, getService, quoteHref, routes } from "@/lib/site";
import { inSentence, telHref } from "@/lib/utils";

// Alleen diensten die in de config aan staan krijgen een pagina; al het andere is een 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveServices().map((service) => ({ slug: service.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!getService(slug)) return {};
  const detail = getServiceDetail(slug);
  const region = site.serviceArea.regionLabel;

  // Patroon: [Dienst] [plaats] | Evers Totaal Montage. De plaats volgt zodra de regio in de config staat.
  return {
    title: region ? `${detail.metaTitle} ${region}` : detail.metaTitle,
    description: detail.metaDescription,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const detail = getServiceDetail(slug);
  const category = site.services.categories.find((item) => item.id === service.category);
  const photo = detail.image ? images[detail.image] : null;
  const relatedProjects = getProjectsForService(slug);
  const relatedServices = detail.related
    .map((relatedSlug) => getService(relatedSlug))
    .filter((item) => item !== undefined);
  const name = inSentence(service.navTitle);

  return (
    <>
      <Breadcrumbs items={[{ label: "Diensten", href: routes.services }, { label: service.title }]} />

      {/* Kop en inleiding */}
      <section aria-labelledby="dienst-titel" className="bg-sand">
        <Container
          className={`grid gap-10 py-12 md:py-16 ${photo ? "lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16" : ""}`}
        >
          <div className="max-w-3xl">
            {category ? <Badge tone="dark">{category.title}</Badge> : null}
            <h1 id="dienst-titel" className="mt-4 text-3xl sm:text-4xl md:text-5xl">
              {detail.heading}
            </h1>
            <div className="mt-5 space-y-4 text-lg text-muted">
              {detail.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={quoteHref(slug)} size="lg">
                Offerte voor {name}
                <Icon name="arrow-right" />
              </ButtonLink>
              <ButtonLink href={telHref(site.contact.phone)} variant="outline" size="lg">
                <Icon name="phone" />
                Bel {site.contact.phoneDisplay}
              </ButtonLink>
            </div>
            {!photo ? (
              <p className="mt-6">
                <ClientTodo>{`foto voor de pagina ${service.title}`}</ClientTodo>
              </p>
            ) : null}
          </div>

          {photo ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              sizes="(min-width: 1024px) 32rem, 100vw"
              className="aspect-4/3 w-full rounded-card object-cover lg:aspect-4/5"
            />
          ) : null}
        </Container>
      </section>

      {/* Wanneer nodig */}
      <Section labelledBy="wanneer-titel">
        <SectionHeading
          id="wanneer-titel"
          eyebrow="Herkent u dit?"
          title="Wanneer heeft u dit nodig?"
          intro={<p>{detail.whenNeeded.intro}</p>}
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {detail.whenNeeded.items.map((item) => (
            <Card as="li" key={item.title}>
              <h3 className="text-lg">{item.title}</h3>
              <p className="mt-2 text-muted">{item.text}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Werkwijze */}
      <Section tone="sand" labelledBy="werkwijze-titel">
        <SectionHeading
          id="werkwijze-titel"
          eyebrow="Werkwijze"
          title="Zo pakken wij het aan"
          intro={`Van eerste afspraak tot oplevering in ${detail.process.length} stappen.`}
        />
        <ol className="mt-10 max-w-3xl space-y-6">
          {detail.process.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4">
              <span
                aria-hidden="true"
                className="grid size-12 place-items-center rounded-full bg-ink font-display text-xl font-extrabold text-white"
              >
                {index + 1}
              </span>
              <div className="border-b border-line pb-6">
                <h3 className="text-xl">
                  <span className="sr-only">Stap {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Materialen, merken en prijs */}
      <Section labelledBy="materialen-titel">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              id="materialen-titel"
              eyebrow="Materialen en merken"
              title="Waarmee wij werken"
              intro={<p>{detail.materials.intro}</p>}
            />
            <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {detail.materials.items.map((item) => (
                <div key={item.title} className="border-t-2 border-brand pt-4">
                  <dt className="font-display text-lg font-extrabold">{item.title}</dt>
                  <dd className="mt-1 text-muted">{item.text}</dd>
                </div>
              ))}
            </dl>
            {detail.materials.brands.length > 0 ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <p className="font-semibold">Merken waarmee wij werken:</p>
                <ul className="flex flex-wrap gap-2">
                  {detail.materials.brands.map((brand) => (
                    <li key={brand}>
                      <Badge>{brand}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* De vanaf-prijs uit de config komt hier in fase 8. Zonder prijs: "Prijs op aanvraag". */}
          <aside aria-labelledby="prijs-titel" className="self-start rounded-card bg-sand p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 id="prijs-titel" className="text-2xl">
              Wat kost het?
            </h2>
            <p className="mt-3 font-display text-xl font-extrabold text-brand-strong">Prijs op aanvraag</p>
            <p className="mt-3 text-muted">Elk dak is anders. De prijs hangt onder meer af van:</p>
            <ul className="mt-4 space-y-2">
              {detail.priceFactors.map((factor) => (
                <li key={factor} className="flex gap-3">
                  <Icon name="check" className="mt-0.5 text-brand-strong" />
                  {factor}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Na een inspectie van uw dak ontvangt u een vrijblijvende offerte met een vaste prijs.
            </p>
            <div className="mt-6">
              <ButtonLink href={quoteHref(slug)} variant="dark" className="w-full">
                Vraag een offerte aan
                <Icon name="arrow-right" />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Section>

      {/* Gerelateerde projecten */}
      {relatedProjects.length > 0 ? (
        <Section tone="sand" labelledBy="projecten-titel">
          <SectionHeading id="projecten-titel" eyebrow="Projecten" title="Ons werk in de praktijk" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {relatedProjects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Veelgestelde vragen bij deze dienst */}
      <Section labelledBy="faq-titel">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading
            id="faq-titel"
            eyebrow="Veelgestelde vragen"
            title={`Vragen over ${name}`}
            intro="Staat uw vraag er niet bij? Bel of mail ons gerust."
          />
          <FaqList items={detail.faq} />
        </div>
      </Section>

      <CtaBand
        title={`Offerte voor ${name} aanvragen?`}
        text="Vertel ons wat er speelt en stuur gerust foto's mee. U ontvangt een vrijblijvende offerte."
        serviceSlug={slug}
      />

      {/* Verwante diensten */}
      {relatedServices.length > 0 ? (
        <Section tone="sand" labelledBy="verwant-titel">
          <SectionHeading id="verwant-titel" eyebrow="Ook interessant" title="Verwante diensten" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((related) => (
              <li key={related.slug}>
                <ServiceCard service={related} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

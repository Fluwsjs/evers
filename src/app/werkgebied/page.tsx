import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@config/site";
import { projects } from "@content/projects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AreaMap } from "@/components/sections/AreaMap";
import { CtaBand } from "@/components/sections/CtaBand";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatList, getActivePlaces, placeHref, projectHref } from "@/lib/site";

const places = getActivePlaces();

export const metadata: Metadata = {
  title: `Werkgebied: dakdekker in ${formatList(places.map((place) => place.name))}`,
  description: `${site.shortName} werkt onder meer in ${formatList(places.map((place) => place.name))}. Bekijk per plaats ons werk en waar u bij uw dak op kunt letten.`,
};

export default function ServiceAreaPage() {
  const names = formatList(places.map((place) => place.name));

  return (
    <>
      <Breadcrumbs items={[{ label: "Werkgebied" }]} />
      <PageHeader
        title="Werkgebied: waar wij werken"
        intro={
          <p>
            {site.serviceArea.summary ??
              `Wij werkten onder meer in ${names}. Hieronder ziet u die plaatsen, met per plaats het werk dat wij er deden.`}
          </p>
        }
      >
        {site.serviceArea.summary === null ? (
          <p className="mt-3">
            <ClientTodo>omschrijving van het werkgebied en de vestigingsplaats</ClientTodo>
          </p>
        ) : null}
      </PageHeader>

      <section aria-labelledby="plaatsen-titel" className="py-12 md:py-16">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <AreaMap places={places} />

          <div>
            <h2 id="plaatsen-titel" className="text-2xl md:text-3xl">
              Plaatsen waar wij werkten
            </h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {places.map((place) => {
                const localProjects = projects.filter((project) => project.placeSlug === place.slug);
                return (
                  <li key={place.slug} className="py-5">
                    <h3 className="text-xl">
                      <Link href={placeHref(place.slug)} className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
                        <Icon name="pin" className="text-brand-strong" />
                        Dakdekker {place.name}
                      </Link>
                    </h3>
                    {localProjects.length > 0 ? (
                      <p className="mt-2 text-muted">
                        Project:{" "}
                        {localProjects.map((project, index) => (
                          <span key={project.slug}>
                            {index > 0 ? ", " : ""}
                            <Link href={projectHref(project.slug)} className="font-semibold text-ink underline underline-offset-4">
                              {project.title}
                            </Link>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 rounded-card bg-sand p-6">
              <h2 className="text-xl">Staat uw plaats er niet bij?</h2>
              <p className="mt-2 text-muted">
                Neem dan gerust contact op. U hoort direct of wij bij u kunnen komen.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        title="Een dakdekker bij u in de buurt?"
        text="Vertel ons waar u woont en wat er moet gebeuren. U ontvangt een vrijblijvende offerte."
      />
    </>
  );
}

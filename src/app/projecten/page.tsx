import type { Metadata } from "next";
import { site } from "@config/site";
import { projects } from "@content/projects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ProjectFilter } from "@/components/sections/ProjectFilter";
import { Container } from "@/components/ui/Container";
import { formatList, getActiveServices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projecten: dakrenovatie en nieuwbouw",
  description: `Bekijk daken die ${site.shortName} heeft gemaakt: ${formatList(projects.map((project) => project.title))}. Met foto's van het werk.`,
};

export default function ProjectsPage() {
  // Alleen diensten waar minstens één project bij hoort komen in het filter.
  const filterOptions = getActiveServices()
    .filter((service) => projects.some((project) => project.serviceSlugs.includes(service.slug)))
    .map((service) => ({ value: service.slug, label: service.navTitle }));

  return (
    <>
      <Breadcrumbs items={[{ label: "Projecten" }]} />

      <section aria-labelledby="projecten-titel" className="bg-sand py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 id="projecten-titel" className="text-3xl sm:text-4xl md:text-5xl">
              Projecten: daken die wij hebben gemaakt
            </h1>
            <p className="mt-5 text-lg text-muted">
              Hier ziet u ons eigen werk, van nieuwbouw tot renovatie. Alle foto&apos;s zijn op onze projecten
              gemaakt.
            </p>
          </div>
        </Container>
      </section>

      <section aria-label="Overzicht van projecten" className="py-12 md:py-16">
        <Container>
          <ProjectFilter
            options={filterOptions}
            items={projects.map((project) => ({
              slug: project.slug,
              serviceSlugs: project.serviceSlugs,
              card: (
                <ProjectCard
                  project={project}
                  headingLevel="h2"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ),
            }))}
          />
        </Container>
      </section>

      <CtaBand
        title="Uw dak ook laten doen?"
        text="Vertel ons wat er moet gebeuren en stuur gerust foto's mee. U ontvangt een vrijblijvende offerte."
      />
    </>
  );
}

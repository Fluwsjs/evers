import { projects } from "@content/projects";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { routes } from "@/lib/site";
import { ProjectCard } from "./ProjectCard";

/**
 * Uitgelichte projecten. De voor/na-schuif komt hieronder zodra er echte
 * voor/na-foto's zijn (`site.features.beforeAfter`); het onderdeel wordt in fase 5 gebouwd.
 */
export function ProjectHighlights({ limit = 3 }: { limit?: number }) {
  const highlighted = projects.slice(0, limit);

  return (
    <Section labelledBy="projecten-titel">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="projecten-titel"
          eyebrow="Projecten"
          title="Daken die wij hebben gemaakt"
          intro="Foto's van ons eigen werk, van nieuwbouw tot renovatie."
        />
        <ButtonLink href={routes.projects} variant="outline">
          Alle projecten
          <Icon name="arrow-right" />
        </ButtonLink>
      </div>

      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {highlighted.map((project, index) => (
          <li key={project.slug}>
            <Reveal delay={index * 80} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

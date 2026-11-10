import { site } from "@config/site";
import { images } from "@content/images.generated";
import { projects } from "@content/projects";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { routes } from "@/lib/site";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { ProjectCard } from "./ProjectCard";

/**
 * Uitgelichte projecten, met daaronder de voor/na-schuif van projecten die een
 * echt voor/na-paar hebben (en alleen als `site.features.beforeAfter` aan staat).
 */
export function ProjectHighlights({ limit = 3 }: { limit?: number }) {
  const highlighted = projects.slice(0, limit);
  const comparisons = site.features.beforeAfter ? projects.filter((project) => project.beforeAfter).slice(0, 2) : [];

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

      {comparisons.length > 0 ? (
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {comparisons.map((project) =>
            project.beforeAfter ? (
              <BeforeAfterSlider
                key={project.slug}
                before={images[project.beforeAfter.before]}
                after={images[project.beforeAfter.after]}
                caption={project.beforeAfter.caption ?? `${project.title}: schuif om het verschil te zien.`}
              />
            ) : null,
          )}
        </div>
      ) : null}
    </Section>
  );
}

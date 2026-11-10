import Image from "next/image";
import Link from "next/link";
import { images } from "@content/images.generated";
import { projects } from "@content/projects";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { projectHref, routes } from "@/lib/site";

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
        {highlighted.map((project, index) => {
          const cover = images[project.cover];
          return (
            <li key={project.slug}>
              <Reveal delay={index * 80} className="h-full">
                <Link href={projectHref(project.slug)} className="group flex h-full flex-col rounded-card">
                  <div className="relative overflow-hidden rounded-card">
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      width={cover.width}
                      height={cover.height}
                      placeholder="blur"
                      blurDataURL={cover.blurDataURL}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge tone="dark" className="absolute top-3 left-3">
                      {project.type}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-xl underline-offset-4 group-hover:underline">{project.title}</h3>
                  <p className="mt-1 text-muted">{project.summary}</p>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

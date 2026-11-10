import Image from "next/image";
import Link from "next/link";
import { images } from "@content/images.generated";
import type { Project } from "@content/projects";
import { Badge } from "@/components/ui/Badge";
import { projectHref } from "@/lib/site";

interface ProjectCardProps {
  project: Project;
  headingLevel?: "h2" | "h3";
  /** `sizes` voor next/image, afhankelijk van het raster waarin de kaart staat. */
  sizes?: string;
}

export function ProjectCard({
  project,
  headingLevel: Heading = "h3",
  sizes = "(min-width: 768px) 33vw, 100vw",
}: ProjectCardProps) {
  const cover = images[project.cover];

  return (
    <Link href={projectHref(project.slug)} className="group flex h-full flex-col rounded-card">
      <div className="relative overflow-hidden rounded-card">
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          placeholder="blur"
          blurDataURL={cover.blurDataURL}
          sizes={sizes}
          className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge tone="dark" className="absolute top-3 left-3">
          {project.type}
        </Badge>
      </div>
      <Heading className="mt-4 text-xl underline-offset-4 group-hover:underline">{project.title}</Heading>
      <p className="mt-1 text-muted">{project.summary}</p>
    </Link>
  );
}

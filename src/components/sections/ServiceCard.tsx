import Link from "next/link";
import type { ServiceSummary } from "@content/services";
import { Icon } from "@/components/ui/Icon";
import { serviceHref } from "@/lib/site";
import { inSentence } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceSummary;
  /** Kopniveau, afhankelijk van de plek op de pagina. */
  headingLevel?: "h2" | "h3";
}

/**
 * Kaart die naar een dienstpagina linkt. De vanaf-prijs per dienst komt erbij in fase 8;
 * een dienst zonder ingevulde prijs toont dan geen bedrag.
 */
export function ServiceCard({ service, headingLevel: Heading = "h3" }: ServiceCardProps) {
  return (
    <Link
      href={serviceHref(service.slug)}
      className="group flex h-full flex-col rounded-card border border-line bg-white p-6 text-ink shadow-card transition-colors hover:border-ink"
    >
      <span aria-hidden="true" className="mb-5 block h-1 w-10 bg-brand transition-all duration-200 group-hover:w-16" />
      <Heading className="text-xl">{service.title}</Heading>
      <p className="mt-2 grow text-muted">{service.shortDescription}</p>
      <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-strong">
        Meer over {inSentence(service.navTitle)}
        <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

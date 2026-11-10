import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export interface Crumb {
  label: string;
  /** Weglaten bij de huidige pagina (het laatste item). */
  href?: string;
}

/**
 * Kruimelpad voor subpagina's. "Home" wordt automatisch vooraan gezet.
 * Zet ook de bijbehorende BreadcrumbList (JSON-LD) in de pagina.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Kruimelpad" className="border-b border-line bg-sand text-sm">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Container>
        <ol className="flex flex-wrap items-center gap-x-2 py-3">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-x-2">
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="text-muted underline underline-offset-4 hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined} className="font-semibold">
                    {crumb.label}
                  </span>
                )}
                {!isLast ? (
                  <span aria-hidden="true" className="text-muted">
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}

import type { ReactNode } from "react";
import { Container } from "./Container";

interface PageHeaderProps {
  id?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}

/** Paginakop voor eenvoudige pagina's: H1 met inleiding op een zandkleurig vlak. */
export function PageHeader({ id = "pagina-titel", title, intro, children }: PageHeaderProps) {
  return (
    <section aria-labelledby={id} className="bg-sand py-12 md:py-16">
      <Container>
        <div className="max-w-3xl">
          <h1 id={id} className="text-3xl sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {intro ? <div className="mt-5 text-lg text-muted">{intro}</div> : null}
          {children}
        </div>
      </Container>
    </section>
  );
}

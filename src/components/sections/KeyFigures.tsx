import { site } from "@config/site";
import { Container } from "@/components/ui/Container";

/** Kerncijfers. Toont niets zolang er geen echte cijfers in de config staan. */
export function KeyFigures() {
  const { keyFigures } = site;
  if (keyFigures.length === 0) return null;

  return (
    <section aria-label="Kerncijfers" className="on-dark bg-ink py-12 text-on-dark">
      <Container>
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {keyFigures.map((figure) => (
            <div key={figure.label} className="flex flex-col-reverse gap-1 border-l-2 border-brand pl-5">
              <dt className="text-on-dark-muted">{figure.label}</dt>
              <dd className="font-display text-4xl font-extrabold text-white md:text-5xl">{figure.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

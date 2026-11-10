import { site } from "@config/site";
import { ButtonLink } from "@/components/ui/Button";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { routes } from "@/lib/site";

/**
 * Sectie "Wat kost uw dak?" op de homepage.
 * De calculator zelf (met rekenmodule en vanaf-prijzen uit de config) wordt in fase 8
 * gebouwd en komt dan op de plek van het blok rechts. Tot dan verwijst de sectie naar /prijzen/.
 */
export function PriceCalculatorSection() {
  if (!site.features.calculator) return null;

  return (
    <Section labelledBy="prijzen-titel" id="prijzen">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="prijzen-titel"
            eyebrow="Prijsindicatie"
            title="Wat kost uw dak?"
            intro="Elk dak is anders, maar u wilt vooraf weten waar u ongeveer op uitkomt. Kies uw werkzaamheden, vul de maten in en u ziet direct een indicatie inclusief btw."
          />
          <ul className="mt-6 space-y-3">
            {[
              "Vanaf-prijzen per m², per meter of per stuk",
              "Met één klik een offerte aanvragen met uw berekening",
              "De definitieve prijs volgt na een inspectie van uw dak",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Icon name="check" className="mt-0.5 text-brand-strong" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href={routes.prices}>
              Bereken uw indicatie
              <Icon name="arrow-right" />
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-card border border-line bg-sand p-8">
          <p className="font-display text-xl font-extrabold">Uw indicatie</p>
          <p className="mt-2 text-muted">
            Hier verschijnt uw berekening zodra u werkzaamheden kiest. De uitkomst is een indicatie op basis van
            vanaf-prijzen, geen offerte.
          </p>
          <p className="mt-4">
            <ClientTodo>calculator volgt in fase 8; vanaf-prijzen per dienst</ClientTodo>
          </p>
        </div>
      </div>
    </Section>
  );
}

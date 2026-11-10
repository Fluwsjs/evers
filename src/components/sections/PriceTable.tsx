import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { formatEuro, unitLabels } from "@/lib/pricing/format";
import { getPriceGroups, hasVisiblePrices } from "@/lib/pricing/price-list";
import { routes, serviceHref } from "@/lib/site";

interface PriceTableSectionProps {
  tone?: "white" | "sand";
  /** Op de homepage: de sectie weglaten zolang er geen prijzen zijn, en doorlinken naar /prijzen/. */
  variant?: "page" | "home";
}

/**
 * Prijstabel per dienst. Werk zonder (bevestigde) prijs staat erin als "Prijs op aanvraag".
 * Op de homepage verschijnt de tabel pas als er minstens één prijs te tonen is.
 */
export function PriceTableSection({ tone = "sand", variant = "page" }: PriceTableSectionProps) {
  const groups = getPriceGroups();
  if (groups.length === 0) return null;
  if (variant === "home" && !hasVisiblePrices()) return null;

  const hasExamples = groups.some((group) => group.items.some((item) => item.example));

  return (
    <Section tone={tone} labelledBy="prijslijst-titel" id="prijslijst">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="prijslijst-titel"
          eyebrow="Prijslijst"
          title="Vanaf-prijzen per dienst"
          intro="Alle bedragen zijn inclusief btw. Een vanaf-prijs is een ondergrens: de prijs voor uw dak kan hoger uitkomen."
        />
        {variant === "home" ? (
          <ButtonLink href={routes.prices} variant="outline">
            Meer over prijzen
            <Icon name="arrow-right" />
          </ButtonLink>
        ) : null}
      </div>
      {hasExamples ? (
        <p className="mt-4">
          <ClientTodo>voorbeeldprijzen: alle bedragen bevestigen of aanpassen</ClientTodo>
        </p>
      ) : null}
      {variant === "page" ? (
        <p className="mt-4">
          <ClientTodo>wat zit er in de vanaf-prijs (steiger, afvoer van oud materiaal, voorrijkosten)</ClientTodo>
        </p>
      ) : null}
      <div className="mt-10 overflow-hidden rounded-card border border-line bg-white shadow-card">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Vanaf-prijzen per dienst, inclusief btw</caption>
          <thead className="max-sm:sr-only">
            <tr className="border-b border-line text-sm text-muted">
              <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                Werkzaamheden
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">
                Vanaf-prijs
              </th>
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.serviceSlug}>
              <tr className="border-b border-line bg-sand-200/60">
                <th scope="rowgroup" colSpan={2} className="px-4 py-3 sm:px-6">
                  <Link
                    href={serviceHref(group.serviceSlug)}
                    className="font-display text-lg font-extrabold underline-offset-4 hover:underline"
                  >
                    {group.title}
                  </Link>
                </th>
              </tr>
              {group.items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 font-normal sm:px-6">
                    {item.label}
                  </th>
                  <td className="px-4 py-3 text-right whitespace-nowrap sm:px-6">
                    {item.unitPrice === null ? (
                      <span className="text-muted">Prijs op aanvraag</span>
                    ) : (
                      <>
                        <span className="font-semibold">{formatEuro(item.unitPrice)}</span>{" "}
                        <span className="text-sm text-muted">{unitLabels[item.unit].per}</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </Section>
  );
}

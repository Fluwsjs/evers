import { quoteParams, roofTypes } from "@content/quote-options";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getServiceGroups, routes } from "@/lib/site";

const legendClasses = "font-display text-lg font-extrabold";
const choiceClasses =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line bg-white px-3 py-2 font-medium has-checked:border-ink has-checked:bg-sand has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-strong";
const inputClasses = "size-5 shrink-0 accent-brand-strong focus-visible:outline-none";

/**
 * Stap 1 van het offerteformulier ("Uw klus"), direct zichtbaar bij de hero.
 *
 * Dit is een gewoon GET-formulier: de keuzes gaan als queryparameters mee naar
 * /offerte-aanvragen/, waar het volledige formulier ze overneemt. Werkt dus ook
 * zonder JavaScript. Er gaan geen persoonsgegevens in de URL.
 */
export function QuoteStarter({ headingId = "offerte-start" }: { headingId?: string }) {
  const groups = getServiceGroups();

  return (
    <form
      action={routes.quote}
      method="get"
      aria-labelledby={headingId}
      className="rounded-card border border-line bg-white p-5 text-ink shadow-card sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h2 id={headingId} className="text-2xl md:text-3xl">
            Vraag een vrijblijvende offerte aan
          </h2>
          <p className="mt-2 text-muted">In drie korte stappen. Begin met wat er moet gebeuren.</p>
        </div>
        <ol aria-label="Stappen van het formulier" className="flex items-center gap-2 text-sm font-semibold">
          {["Uw klus", "Details", "Gegevens"].map((step, index) => (
            <li
              key={step}
              aria-current={index === 0 ? "step" : undefined}
              className="flex items-center gap-2 text-muted aria-[current=step]:text-ink"
            >
              <span
                aria-hidden="true"
                className={`grid size-7 place-items-center rounded-full ${index === 0 ? "bg-brand text-ink" : "bg-sand-200 text-muted"}`}
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <fieldset>
          <legend className={legendClasses}>Waar heeft u hulp bij nodig?</legend>
          <p className="mt-1 text-sm text-muted">Meerdere keuzes mogelijk.</p>
          <div className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.category.id}>
                <p className="mb-2 text-sm font-semibold text-muted">{group.category.title}</p>
                <div className="space-y-2">
                  {group.services.map((service) => (
                    <label key={service.slug} className={choiceClasses}>
                      <input type="checkbox" name={quoteParams.service} value={service.slug} className={inputClasses} />
                      {service.navTitle}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="space-y-8">
          <fieldset>
            <legend className={legendClasses}>Wat voor dak heeft u?</legend>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {roofTypes.map((roofType) => (
                <label key={roofType.value} className={choiceClasses}>
                  <input type="radio" name={quoteParams.roofType} value={roofType.value} className={inputClasses} />
                  {roofType.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={legendClasses}>Is het spoed?</legend>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <label className={choiceClasses}>
                <input type="radio" name={quoteParams.urgent} value="ja" className={inputClasses} />
                Ja
              </label>
              <label className={choiceClasses}>
                <input type="radio" name={quoteParams.urgent} value="nee" defaultChecked className={inputClasses} />
                Nee
              </label>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
        <Button type="submit" size="lg">
          Volgende stap
          <Icon name="arrow-right" />
        </Button>
        <p className="text-sm text-muted">Weet u het nog niet precies? Ga gewoon verder en omschrijf uw situatie.</p>
      </div>
    </form>
  );
}

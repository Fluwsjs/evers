import { quoteParams, roofTypes } from "@content/quote-options";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getActiveServices, routes } from "@/lib/site";

const legendClasses = "font-display text-base font-extrabold";
const choiceClasses =
  "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2 text-[0.9375rem] leading-snug font-medium transition-colors hover:border-ink-700/50 has-checked:border-ink has-checked:bg-sand has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-strong";
const inputClasses = "size-5 shrink-0 accent-brand-strong focus-visible:outline-none";
const labelTextClasses = "min-w-0 hyphens-auto";

const STEPS = ["Uw klus", "Details", "Gegevens"];

/**
 * Stap 1 van het offerteformulier ("Uw klus"), als kaart in de hero.
 *
 * Dit is een gewoon GET-formulier: de keuzes gaan als queryparameters mee naar
 * /offerte-aanvragen/, waar het volledige formulier ze overneemt. Werkt dus ook
 * zonder JavaScript. Er gaan geen persoonsgegevens in de URL.
 */
export function QuoteStarter({ headingId = "offerte-start" }: { headingId?: string }) {
  const services = getActiveServices();

  return (
    <form
      action={routes.quote}
      method="get"
      aria-labelledby={headingId}
      className="overflow-hidden rounded-card bg-white text-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)]"
    >
      <div className="border-t-4 border-brand px-5 pt-5 sm:px-7 sm:pt-6">
        <h2 id={headingId} className="text-2xl">
          Vraag een vrijblijvende offerte aan
        </h2>
        <p className="mt-1 text-muted">In drie korte stappen. Begin met wat er moet gebeuren.</p>

        <ol aria-label="Stappen van het formulier" className="mt-4 grid grid-cols-3 gap-2 text-sm font-semibold">
          {STEPS.map((step, index) => (
            <li
              key={step}
              aria-current={index === 0 ? "step" : undefined}
              className="text-muted aria-[current=step]:text-ink"
            >
              <span aria-hidden="true" className={`mb-1.5 block h-1 rounded-full ${index === 0 ? "bg-brand" : "bg-sand-200"}`} />
              <span aria-hidden="true">{index + 1}. </span>
              <span className="sr-only">Stap {index + 1}: </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-7">
        <fieldset>
          <legend className={legendClasses}>
            Waar heeft u hulp bij nodig? <span className="font-sans text-sm font-normal text-muted">Meerdere keuzes mogelijk</span>
          </legend>
          <div className="mt-2.5 grid gap-2 min-[25rem]:grid-cols-2">
            {services.map((service) => (
              <label key={service.slug} className={choiceClasses}>
                <input type="checkbox" name={quoteParams.service} value={service.slug} className={inputClasses} />
                <span className={labelTextClasses}>{service.navTitle}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legendClasses}>Wat voor dak heeft u?</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {roofTypes.map((roofType) => (
              <label key={roofType.value} className={choiceClasses}>
                <input type="radio" name={quoteParams.roofType} value={roofType.value} className={inputClasses} />
                <span className={labelTextClasses}>{roofType.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legendClasses}>Is het spoed?</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
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

      <div className="border-t border-line bg-sand px-5 py-4 sm:px-7">
        <Button type="submit" size="lg" className="w-full">
          Volgende stap
          <Icon name="arrow-right" />
        </Button>
        <p className="mt-3 text-center text-sm text-muted">
          Weet u het nog niet precies? Ga gewoon verder en omschrijf uw situatie.
        </p>
      </div>
    </form>
  );
}

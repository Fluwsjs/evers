import { quoteParams, roofTypes } from "@content/quote-options";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getActiveServices, routes } from "@/lib/site";

const questionClasses = "font-display text-lg font-extrabold";

const STEPS = ["Uw klus", "Details", "Gegevens"];

/**
 * Stap 1 van het offerteformulier ("Uw klus"), als kaart in de hero: diensten, type dak
 * en spoed. De diensten zijn aanklikbare blokken, het type dak is één keuzelijst en spoed
 * één vinkje, zodat de kaart rustig en laag blijft en de knop op een laptop in beeld staat.
 *
 * Dit is een gewoon GET-formulier: de keuzes gaan als queryparameters mee naar
 * /offerte-aanvragen/, waar het volledige formulier ze overneemt. Werkt dus ook
 * zonder JavaScript. Er gaan geen persoonsgegevens in de URL.
 */
export function QuoteStarter({ headingId = "offerte-start" }: { headingId?: string }) {
  const services = getActiveServices();
  const roofId = `${headingId}-dak`;

  return (
    <form
      action={routes.quote}
      method="get"
      aria-labelledby={headingId}
      className="rounded-2xl bg-white p-6 text-ink shadow-[0_30px_70px_-25px_rgb(0_0_0/0.6)] sm:p-7"
    >
      <h2 id={headingId} className="text-2xl xl:text-[1.7rem]">
        Vraag een vrijblijvende offerte aan
      </h2>

      {/* Voortgang: drie stappen boven één balk. */}
      <ol aria-label="Stappen van het formulier" className="mt-5 flex justify-between gap-3 text-sm font-semibold">
        {STEPS.map((step, index) => (
          <li
            key={step}
            aria-current={index === 0 ? "step" : undefined}
            className="flex items-center gap-2 text-muted aria-[current=step]:text-ink"
          >
            <span
              aria-hidden="true"
              className={`grid size-6 place-items-center rounded-full text-xs ${index === 0 ? "bg-brand text-ink" : "bg-sand-200 text-muted"}`}
            >
              {index + 1}
            </span>
            <span className="sr-only">Stap {index + 1}: </span>
            {step}
          </li>
        ))}
      </ol>
      <span aria-hidden="true" className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-sand-200">
        <span className="block h-full w-1/3 rounded-full bg-brand" />
      </span>

      <fieldset className="mt-6">
        <legend className={questionClasses}>
          Waar heeft u hulp bij nodig?{" "}
          <span className="font-sans text-sm font-normal whitespace-nowrap text-muted">Meerdere keuzes mogelijk</span>
        </legend>
        <div className="mt-3 grid gap-2 min-[25rem]:grid-cols-2">
          {services.map((service) => (
            <label
              key={service.slug}
              className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[0.9375rem] leading-snug lg:max-xl:text-sm font-semibold transition-colors hover:border-ink-700/50 has-checked:border-ink has-checked:bg-sand has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-strong"
            >
              <input type="checkbox" name={quoteParams.service} value={service.slug} className="peer sr-only" />
              <span
                aria-hidden="true"
                className="grid size-5.5 shrink-0 place-items-center rounded-md border-2 border-ink-700/30 text-transparent transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-ink"
              >
                <Icon name="check" className="size-3.5" />
              </span>
              <span className="min-w-0 hyphens-auto">{service.navTitle}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Type dak en spoed naast elkaar: één keuzelijst en één vinkje. */}
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <div className="relative">
          <label htmlFor={roofId} className="sr-only">
            Wat voor dak heeft u?
          </label>
          <select
            id={roofId}
            name={quoteParams.roofType}
            defaultValue=""
            className="min-h-12 w-full cursor-pointer appearance-none rounded-lg border border-line bg-white py-2 pr-11 pl-3.5 text-[0.9375rem] font-semibold text-ink hover:border-ink-700/50"
          >
            <option value="">Wat voor dak heeft u?</option>
            {roofTypes.map((roofType) => (
              <option key={roofType.value} value={roofType.value}>
                {roofType.label}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-brand-strong" />
        </div>
        <label className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-white px-3 text-[0.9375rem] font-semibold transition-colors hover:border-ink-700/50 has-checked:border-ink has-checked:bg-sand has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-strong">
          <input type="checkbox" name={quoteParams.urgent} value="ja" className="peer sr-only" />
          <span
            aria-hidden="true"
            className="grid size-5.5 shrink-0 place-items-center rounded-md border-2 border-ink-700/30 text-transparent transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-ink"
          >
            <Icon name="check" className="size-3.5" />
          </span>
          Het is spoed
        </label>
      </div>

      <Button type="submit" size="lg" className="mt-4 w-full">
        Volgende stap
        <Icon name="arrow-right" />
      </Button>
      <p className="mt-3 text-center text-sm text-muted">Weet u het nog niet precies? Ga gewoon verder.</p>
    </form>
  );
}

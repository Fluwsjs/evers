import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@config/site";
import { processSteps } from "@content/process";
import { ButtonLink } from "@/components/ui/Button";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { routes } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { Reference } from "./Reference";

export const metadata: Metadata = {
  title: "Bedankt voor uw aanvraag",
  robots: { index: false, follow: false },
};

/** Bedankpagina na het versturen van een formulier. Niet geïndexeerd. */
export default function ThanksPage() {
  const { contact } = site;

  return (
    <section aria-labelledby="bedankt-titel" className="bg-sand py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-brand text-ink">
            <Icon name="check" className="size-7" />
          </span>
          <h1 id="bedankt-titel" className="mt-6 text-3xl sm:text-4xl md:text-5xl">
            Bedankt, wij hebben uw aanvraag ontvangen
          </h1>
          <p className="mt-5 text-lg text-muted">
            Wij nemen contact met u op om uw situatie te bespreken. Heeft u een e-mailadres opgegeven, dan ontvangt u
            daar een bevestiging met een overzicht van uw aanvraag.
          </p>
          {/* TODO: aanleveren door klant (reactietijd, bijvoorbeeld "binnen één werkdag") */}
          <p className="mt-3">
            <ClientTodo>reactietijd na een aanvraag</ClientTodo>
          </p>
          <Suspense fallback={null}>
            <Reference />
          </Suspense>

          <h2 className="mt-12 text-2xl">Hoe gaat het verder?</h2>
          <ol className="mt-5 space-y-4">
            {processSteps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-full bg-ink font-display font-extrabold text-white"
                >
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-card bg-white p-6 shadow-card">
            <h2 className="text-xl">Is het dringend?</h2>
            <p className="mt-2 text-muted">Wacht dan niet op ons bericht, maar bel direct.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href={telHref(contact.phone)}>
                <Icon name="phone" />
                Bel {contact.phoneDisplay}
              </ButtonLink>
              <ButtonLink href={routes.home} variant="outline">
                Terug naar de homepage
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

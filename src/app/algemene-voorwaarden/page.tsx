import type { Metadata } from "next";
import { site } from "@config/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { mailHref, telHref } from "@/lib/utils";

/**
 * Algemene voorwaarden.
 *
 * De voorwaarden zelf kan alleen de klant aanleveren; die verzinnen wij niet. Zolang de
 * tekst ontbreekt, verwijst deze pagina naar het bedrijf en wordt ze niet geïndexeerd.
 * Zodra de klant de voorwaarden aanlevert (als tekst of pdf) komen ze hier te staan en
 * kan `robots` weg.
 *
 * TODO: aanleveren door klant (algemene voorwaarden, als tekst of pdf)
 */
export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: `De algemene voorwaarden van ${site.name}.`,
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  const { contact } = site;

  return (
    <>
      <Breadcrumbs items={[{ label: "Algemene voorwaarden" }]} />
      <PageHeader
        title="Algemene voorwaarden"
        intro={`Op offertes en opdrachten van ${site.shortName} zijn algemene voorwaarden van toepassing.`}
      >
        <p className="mt-3">
          <ClientTodo>algemene voorwaarden aanleveren (tekst of pdf)</ClientTodo>
        </p>
      </PageHeader>

      <div className="py-12 md:py-16">
        <Container>
          <Prose>
            <p>
              U kunt de algemene voorwaarden bij ons opvragen. Bel{" "}
              <a href={telHref(contact.phone)}>{contact.phoneDisplay}</a> of stuur een e-mail naar{" "}
              <a href={mailHref(contact.email)}>{contact.email}</a>, dan sturen wij ze u toe.
            </p>
          </Prose>
        </Container>
      </div>
    </>
  );
}

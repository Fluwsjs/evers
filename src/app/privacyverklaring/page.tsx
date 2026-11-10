import type { Metadata } from "next";
import { site } from "@config/site";
import { photoLimits } from "@content/quote-options";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { mailHref, telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: `Hoe ${site.name} omgaat met uw persoonsgegevens: welke gegevens wij verwerken, waarom, hoe lang wij ze bewaren en welke rechten u heeft.`,
};

/**
 * Privacyverklaring.
 *
 * Deze tekst beschrijft wat de website technisch doet (formulieren, mail, adres opzoeken,
 * spambeveiliging) en is daarop afgestemd. Het is een opzet: de klant, of een jurist, moet
 * de inhoud controleren en de bewaartermijnen en bedrijfsgegevens vaststellen.
 *
 * TODO: aanleveren door klant (privacyverklaring laten controleren; bewaartermijnen vaststellen)
 */
const LAST_UPDATED = "10 november 2026";

const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export default function PrivacyPage() {
  const { address, contact, registration } = site;
  const name = site.legalName ?? site.name;

  return (
    <>
      <Breadcrumbs items={[{ label: "Privacyverklaring" }]} />
      <PageHeader
        title="Privacyverklaring"
        intro={`In deze verklaring leest u welke persoonsgegevens ${site.shortName} verwerkt, waarvoor wij ze gebruiken en welke rechten u heeft.`}
      >
        <p className="mt-4 text-sm text-muted">Laatst bijgewerkt op {LAST_UPDATED}.</p>
        <p className="mt-3">
          <ClientTodo>privacyverklaring laten controleren door de klant of een jurist</ClientTodo>
        </p>
      </PageHeader>

      <div className="py-12 md:py-16">
        <Container>
          <Prose>
            <h2 className="mt-0!">Wie is verantwoordelijk?</h2>
            <p>
              {name} is verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in deze
              verklaring.
            </p>
            <ul>
              <li>
                Adres:{" "}
                {address.confirmed && address.street && address.city ? (
                  `${address.street}, ${[address.postalCode, address.city].filter(Boolean).join(" ")}`
                ) : (
                  <ClientTodo>adres</ClientTodo>
                )}
              </li>
              <li>KvK-nummer: {registration.kvk ?? <ClientTodo>KvK-nummer</ClientTodo>}</li>
              <li>
                Telefoon: <a href={telHref(contact.phone)}>{contact.phoneDisplay}</a>
              </li>
              <li>
                E-mail: <a href={mailHref(contact.email)}>{contact.email}</a>
              </li>
            </ul>

            <h2>Welke gegevens verwerken wij?</h2>
            <p>Wij verwerken alleen gegevens die u zelf aan ons geeft, via de formulieren op deze website, per e-mail, telefonisch of via WhatsApp.</p>
            <h3>Offerteformulier</h3>
            <ul>
              <li>Uw naam, telefoonnummer en e-mailadres</li>
              <li>Het adres van het dak: postcode, huisnummer, straat en plaats</li>
              <li>Uw keuzes (diensten, type dak, spoed) en uw omschrijving</li>
              <li>Foto&apos;s die u meestuurt (maximaal {photoLimits.maxFiles})</li>
              <li>Uw voorkeur voor het moment waarop wij contact opnemen</li>
            </ul>
            <h3>Terugbelformulier</h3>
            <ul>
              <li>Uw naam, telefoonnummer en het moment waarop u gebeld wilt worden</li>
            </ul>
            <h3>Contactformulier</h3>
            <ul>
              <li>Uw naam, e-mailadres, eventueel uw telefoonnummer, en uw bericht</li>
            </ul>
            <p>
              Stuur via de formulieren geen bijzondere of gevoelige gegevens mee, zoals gezondheidsgegevens of een
              kopie van een identiteitsbewijs. Let er bij foto&apos;s op dat er geen herkenbare personen op staan.
            </p>

            <h2>Waarvoor gebruiken wij uw gegevens?</h2>
            <ul>
              <li>
                <strong>Om uw aanvraag of vraag te behandelen</strong>: contact met u opnemen, uw dak beoordelen en
                een offerte maken. Dit doen wij op uw verzoek, als voorbereiding op een mogelijke overeenkomst.
              </li>
              <li>
                <strong>Om een opdracht uit te voeren</strong>: plannen, uitvoeren, factureren en garantie afhandelen.
                Dit is nodig voor de uitvoering van de overeenkomst.
              </li>
              <li>
                <strong>Om aan wettelijke verplichtingen te voldoen</strong>, zoals de fiscale bewaarplicht voor onze
                administratie.
              </li>
            </ul>
            <p>Wij gebruiken uw gegevens niet voor nieuwsbrieven of reclame en verkopen ze niet aan anderen.</p>

            <h2>Hoe lang bewaren wij uw gegevens?</h2>
            <p>Wij bewaren uw gegevens niet langer dan nodig is voor het doel waarvoor u ze heeft gegeven.</p>
            <ul>
              <li>
                Aanvragen die niet tot een opdracht leiden: <ClientTodo>bewaartermijn vaststellen, bijvoorbeeld 12 maanden</ClientTodo>
              </li>
              <li>
                Gegevens over een uitgevoerde opdracht: zolang de garantie loopt, en in onze administratie zolang de
                wet dat voorschrijft (voor de Belastingdienst is dat zeven jaar).
              </li>
            </ul>
            <p>
              De website zelf slaat uw aanvraag niet op. De gegevens uit een formulier worden direct per e-mail naar
              ons verzonden; u ontvangt daarvan een bevestiging als u een e-mailadres heeft ingevuld.
            </p>

            <h2>Met wie delen wij uw gegevens?</h2>
            <p>
              Wij delen uw gegevens alleen met partijen die wij nodig hebben om deze website en onze e-mail te laten
              werken. Zij mogen de gegevens niet voor eigen doelen gebruiken.
            </p>
            <ul>
              <li>
                <strong>Hosting van de website</strong>: Hetzner Online GmbH, met servers in de Europese Unie.{" "}
                <ClientTodo>hostingpartij bevestigen</ClientTodo>
              </li>
              <li>
                <strong>E-mail</strong>: de dienst waarmee wij e-mail verzenden en ontvangen.{" "}
                <ClientTodo>naam van de mailprovider</ClientTodo>
              </li>
              <li>
                <strong>Adres opzoeken</strong>: als u in het offerteformulier een postcode en huisnummer invult,
                zoeken wij de bijbehorende straat en plaats op via de Locatieserver van PDOK (een dienst van de
                Nederlandse overheid). Alleen de postcode en het huisnummer worden daarvoor doorgegeven, via onze
                eigen server; uw naam en andere gegevens gaan niet mee.
              </li>
              {turnstileEnabled ? (
                <li>
                  <strong>Bescherming tegen spam</strong>: de formulieren gebruiken Cloudflare Turnstile om
                  geautomatiseerde inzendingen te herkennen. Cloudflare verwerkt daarbij technische gegevens van uw
                  browser en uw IP-adres.
                </li>
              ) : null}
              <li>
                <strong>WhatsApp</strong>: kiest u ervoor om ons via WhatsApp te benaderen, dan verloopt dat gesprek
                via WhatsApp (Meta) en gelden ook hun voorwaarden.
              </li>
            </ul>

            <h2>Cookies en statistieken</h2>
            <p>
              Deze website plaatst geen cookies om u te volgen en bevat geen advertenties. Daarom ziet u geen
              cookiemelding. De lettertypen en afbeeldingen worden vanaf onze eigen server geladen, niet vanaf
              servers van derden.
            </p>
            <p>
              Als wij bezoekersstatistieken bijhouden, doen wij dat met een dienst die geen cookies gebruikt en
              bezoekers niet individueel herkent.
            </p>

            <h2>Beveiliging</h2>
            <p>
              De verbinding met deze website is versleuteld (https). De formulieren zijn beveiligd tegen misbruik, en
              gegevens uit formulieren worden niet in logbestanden van de website vastgelegd.
            </p>

            <h2>Uw rechten</h2>
            <p>U heeft het recht om:</p>
            <ul>
              <li>uw gegevens in te zien;</li>
              <li>onjuiste gegevens te laten verbeteren;</li>
              <li>uw gegevens te laten verwijderen;</li>
              <li>de verwerking te laten beperken of er bezwaar tegen te maken;</li>
              <li>uw gegevens in een gangbaar formaat te ontvangen.</li>
            </ul>
            <p>
              Stuur daarvoor een e-mail naar <a href={mailHref(contact.email)}>{contact.email}</a>. Wij reageren
              binnen een maand. Om zeker te weten dat het verzoek van u komt, kunnen wij u vragen om u te
              identificeren.
            </p>
            <p>
              Bent u het niet eens met hoe wij met uw gegevens omgaan? Laat het ons weten. U heeft daarnaast het
              recht om een klacht in te dienen bij de{" "}
              <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">
                Autoriteit Persoonsgegevens
                <span className="sr-only"> (opent in een nieuw tabblad)</span>
              </a>
              .
            </p>

            <h2>Wijzigingen</h2>
            <p>
              Wij kunnen deze verklaring aanpassen, bijvoorbeeld als de website verandert. De datum bovenaan laat
              zien wanneer de tekst voor het laatst is bijgewerkt.
            </p>
          </Prose>
        </Container>
      </div>
    </>
  );
}

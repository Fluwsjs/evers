import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@config/site";
import { images } from "@content/images.generated";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectHighlights } from "@/components/sections/ProjectHighlights";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getActiveServices } from "@/lib/site";
import { inSentence } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Over ons",
  description: `Maak kennis met ${site.name}: dakdekkers voor renovatie en nieuwbouw. VCA-gecertificeerd, met garantie op het werk. Lees hoe wij werken.`,
};

/** Wat op de huidige site onder "Waar staan wij voor?" staat, concreter gemaakt. */
const principles = [
  {
    title: "Vakwerk in de details",
    text: "Een dak lekt zelden midden in het vlak. Het gaat mis bij de kilgoot, de schoorsteen of de dakkapel. Daar besteden wij de meeste aandacht aan.",
  },
  {
    title: "Duidelijk vooraf",
    text: "U krijgt een offerte waarin staat wat wij doen, met welke materialen en wat het kost. Komt er tijdens het werk iets onverwachts aan het licht, dan overleggen wij eerst.",
  },
  {
    title: "Veilig en netjes werken",
    text: "Wij werken met steiger en valbeveiliging volgens de VCA-regels, en laten de werkplek opgeruimd achter.",
  },
];

export default function AboutPage() {
  const { owner, shortName, certifications, warranty, brands } = site;
  const photo = images.dakdekkerZinkwerk;
  const secondPhoto = images.renovatieRijwoningen;
  const services = getActiveServices();
  const vca = certifications.find((certification) => certification.name === "VCA");

  return (
    <>
      <Breadcrumbs items={[{ label: "Over ons" }]} />

      {/* Kop */}
      <section aria-labelledby="over-ons-titel" className="bg-sand">
        <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <div>
            <h1 id="over-ons-titel" className="text-3xl sm:text-4xl md:text-5xl">
              Over {shortName}
            </h1>
            <div className="mt-5 space-y-4 text-lg text-muted">
              <p>
                {shortName} is een dakdekkersbedrijf voor renovatie en nieuwbouw. Wij werken aan hellende en platte
                daken en doen alles wat daarbij komt kijken:{" "}
                {services
                  .slice(2)
                  .map((service) => inSentence(service.navTitle))
                  .join(", ")}
                .
              </p>
              <p>
                Wij werken voor particulieren die hun dak willen laten vernieuwen of herstellen, en in de nieuwbouw,
                waar wij de daken van complete woonblokken dekken.
              </p>
            </div>
          </div>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            priority
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            sizes="(min-width: 1024px) 32rem, 100vw"
            className="aspect-4/3 w-full rounded-card object-cover lg:aspect-4/5"
          />
        </Container>
      </section>

      {/* Eigenaar en team: pas zichtbaar als de klant de gegevens aanlevert */}
      {owner.name ? (
        <Section labelledBy="eigenaar-titel">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            {owner.photo ? (
              <Image
                src={owner.photo}
                alt={`${owner.name}, ${owner.role ?? "eigenaar"} van ${shortName}`}
                width={800}
                height={1000}
                sizes="(min-width: 1024px) 28rem, 100vw"
                className="aspect-4/5 w-full rounded-card object-cover"
              />
            ) : null}
            <div>
              <SectionHeading id="eigenaar-titel" eyebrow="Wie wij zijn" title={owner.name} />
              {owner.role ? <p className="mt-2 text-lg font-semibold">{owner.role}</p> : null}
              {/* TODO: aanleveren door klant (het verhaal van de eigenaar: achtergrond, hoe het bedrijf is ontstaan, het team) */}
              <p className="mt-4">
                <ClientTodo>verhaal van de eigenaar en het team</ClientTodo>
              </p>
            </div>
          </div>
        </Section>
      ) : (
        <Container className="pt-10">
          <ClientTodo>naam, foto en verhaal van de eigenaar en het team (deze sectie verschijnt zodra de naam in de config staat)</ClientTodo>
        </Container>
      )}

      {/* Werkwijze */}
      <Section labelledBy="waarden-titel">
        <SectionHeading id="waarden-titel" eyebrow="Waar wij voor staan" title="Zo werken wij" />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {principles.map((principle) => (
            <Card as="li" key={principle.title}>
              <span aria-hidden="true" className="mb-5 block h-1 w-10 bg-brand" />
              <h3 className="text-xl">{principle.title}</h3>
              <p className="mt-2 text-muted">{principle.text}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* VCA en garantie */}
      <Section tone="sand" labelledBy="zekerheid-titel">
        <SectionHeading
          id="zekerheid-titel"
          eyebrow="Zekerheid"
          title="VCA en garantie, concreet"
          intro="Twee woorden die u op veel websites leest. Dit is wat ze bij ons betekenen."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <Badge tone="dark">VCA-gecertificeerd</Badge>
            <h3 className="mt-4 text-2xl">Wat is VCA?</h3>
            <div className="mt-3 space-y-3 text-muted">
              <p>
                VCA staat voor Veiligheid, Gezondheid en Milieu Checklist Aannemers. Het is de norm voor veilig werken
                in onder meer de bouw. Een onafhankelijke instelling controleert of een bedrijf eraan voldoet.
              </p>
              <p>
                Voor u betekent het dat wij werken met de juiste steigers, valbeveiliging en beschermingsmiddelen, dat
                risico&apos;s vooraf worden ingeschat en dat de mensen op uw dak daarvoor zijn opgeleid. Dakwerk is
                werken op hoogte; dat hoort veilig te gebeuren, ook voor u en uw omgeving.
              </p>
            </div>
            {vca && (!vca.description || !vca.number) ? (
              <p className="mt-4">
                <ClientTodo>VCA-variant en certificaatnummer</ClientTodo>
              </p>
            ) : null}
            {vca?.description ? <p className="mt-4 font-semibold">{vca.description}</p> : null}
            {vca?.number ? <p className="text-sm text-muted">Certificaatnummer: {vca.number}</p> : null}
          </Card>

          <Card>
            <Badge tone="brand">Garantie</Badge>
            <h3 className="mt-4 text-2xl">{warranty.summary}</h3>
            <div className="mt-3 space-y-3 text-muted">
              <p>
                U krijgt garantie op het werk dat wij uitvoeren. Welke garantie voor uw klus geldt, staat in de
                offerte, zodat u vooraf weet waar u op kunt rekenen.
              </p>
              <p>
                Daarnaast geven fabrikanten garantie op hun materialen, zoals dakpannen en dakramen. Die
                fabrieksgarantie staat los van onze garantie op de uitvoering.
              </p>
            </div>
            {warranty.terms.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {warranty.terms.map((term) => (
                  <li key={term} className="flex gap-3">
                    <Icon name="check" className="mt-0.5 text-brand-strong" />
                    {term}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4">
                <ClientTodo>garantietermijnen per soort werk</ClientTodo>
              </p>
            )}
          </Card>
        </div>
      </Section>

      {/* Merken */}
      {brands.length > 0 ? (
        <Section labelledBy="merken-titel">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                id="merken-titel"
                eyebrow="Materialen"
                title="Merken waarmee wij werken"
                intro="Een dak is zo goed als het materiaal waarvan het is gemaakt. Wij werken met producten van bekende fabrikanten."
              />
              <ul className="mt-8 flex flex-wrap gap-3">
                {brands.map((brand) => (
                  <li
                    key={brand.name}
                    className="rounded-lg border border-line bg-white px-4 py-2 font-display text-lg font-extrabold"
                  >
                    {brand.name}
                  </li>
                ))}
              </ul>
            </div>
            <Image
              src={secondPhoto.src}
              alt={secondPhoto.alt}
              width={secondPhoto.width}
              height={secondPhoto.height}
              placeholder="blur"
              blurDataURL={secondPhoto.blurDataURL}
              sizes="(min-width: 1024px) 36rem, 100vw"
              className="aspect-4/3 w-full rounded-card object-cover"
            />
          </div>
        </Section>
      ) : null}

      <ProjectHighlights />

      <CtaBand
        title="Kennismaken?"
        text="Vertel ons wat er aan uw dak moet gebeuren. Wij komen kijken en maken een vrijblijvende offerte."
      />
    </>
  );
}

# Plan – Nieuwe website Dakdekkersbedrijf Evers Totaal Montage

Fase 1 van de masterprompt. Status: **wacht op akkoord**. Er is nog geen code geschreven.

## 1. Analyse huidige site

Bekeken op 10-11-2026: home, over-ons, diensten, projecten, contact, de drie projectpagina's en `/wp-sitemap.xml`.

**Bevestigd uit de masterprompt**

- `/contact/` spoedknop linkt naar `tel:0123456789`; het zichtbare nummer is wel goed.
- Icoontjes en decoratie komen van `themedox.com/roofx` (hero-shapes, about-, services-, support- en work-iconen).
- Geen enkele pagina heeft een H1; alles is H2. Op `/diensten/` staat elke dienst twee keer als H2 plus een lege H2.
- Geen meta description, titels zonder dienst of plaats, geen structured data.
- Drie formulieren (Contact Form 7) met verschillende velden.
- Projectpagina's bevatten alleen een H2 en foto's.

**Extra gevonden**

- De WordPress-sitemap bevat veel **demo-inhoud van het thema** die nu geïndexeerd kan zijn: 11 Engelstalige blogposts (o.a. `/hello-world/`, `/twin-cities-commercial-roofing-services/`), en de pagina's `/sample-page/`, `/home/`, `/home-two/`, `/home-four/`, `/blog/`, `/services-details/`, `/project-details/`, `/team/`, `/team-details/`, `/elementor-hf/footer/`, plus 7 categorie- en 7 tag-archieven en `/author/adminjvh/`. Die krijgen allemaal een redirect of 410 (zie §7).
- `/nieuwbouw/` is het project in Zutphen (3 foto's). Schuytgraaf heeft 7 foto's, Elst 8. Daarnaast staan er 4 sfeerfoto's op over-ons en 1 hero-foto.
- Het logo is maar **160×160 px** (PNG). Te klein voor een scherpe header op retina en voor een OG-afbeelding.
- De kaart op contact zoekt op "Anna Blamanstraat 10" zonder plaats, op zoomniveau 7. De plaats is dus niet af te leiden.
- De huidige teksten zeggen "jarenlange ervaring" en "tientallen projecten". "Meer dan 10 jaar" heb ik op de pagina's niet letterlijk teruggevonden; dat blijft een placeholder tot de klant het bevestigt.
- Het dienstenformulier kent ook "Groen dak" als daktype.

**Logo en kleur**

Zwart woordmerk (EVERS · huisje · TOTAAL, daaronder MONTAGE) met een oranje dakaccent, ongeveer `#F0541E`.

## 2. Analyse benchmark (macodakonderhoud.nl)

Wat goed werkt en als concept wordt overgenomen:

- Topbalk: noodbereikbaarheid, e-mail, Google-score, telefoon.
- Hero met werkfoto, één H1, zes USP's, twee CTA's, Google-score; direct daaronder het offerteformulier (stappen: Uw klus → Opmerkingen → Gegevens), met "nog een dienst toevoegen".
- Merkenbalk, kerncijfers, over-ons met namen en foto van de eigenaren.
- Vier dienstkaarten met vanaf-prijs en daaronder alle diensten in vijf groepen.
- Prijstabel in drie blokken plus calculator: werkzaamheden kiezen → maten invullen → totaal incl. btw → "Offerte aanvragen met deze gegevens", met disclaimer.
- Stappenplan, projecten met voor/na-schuif, Google-reviews, werkgebied in twee regio's, FAQ, terugbelformulier met voorkeursmoment.
- Vaste mobiele balk (Bellen / Offerte), `llms.txt`, JSON-LD `RoofingContractor`, `WebSite`, `FAQPage`.

Bewust anders bij Evers:

- Geen chat-assistent, geen blog, geen video (niet gevraagd, geen materiaal).
- MACO heeft ~30 dienstpagina's op rootniveau; Evers start met 6 onder `/diensten/`. Liever zes goede dan dertig dunne.
- Geen "gratis inspectie"-, "24/7"- of garantiejaren-claims zolang de klant die niet bevestigt.
- Eigen kleur, typografie, teksten en beeld. Niets van MACO wordt gekopieerd.

## 3. Sitemap

Zoals in de masterprompt. Aanvullingen:

| Route | Opmerking |
|---|---|
| `/diensten/[slug]/` | `dakrenovatie`, `platte-daken`, `schoorsteenrenovatie`, `lood-en-zinkwerk`, `timmerwerk`, `velux-dakramen`. De 8 optionele diensten staan in de content maar `enabled: false`. |
| `/projecten/[slug]/` | `nieuwbouw-zutphen`, `nieuwbouw-schuytgraaf-arnhem`, `dakrenovatie-elst` |
| `/dakdekker-[plaats]/` | Start: `elst`, `zutphen`, plus de vestigingsplaats zodra bekend. Voorstel: ook `arnhem` (project Schuytgraaf ligt daar) — graag bevestigen. |
| `/api/quote`, `/api/callback` | Route handlers voor de formulieren (multipart vanwege foto's) |
| `/api/postcode` | Proxy naar PDOK Locatieserver (gratis, overheid) voor plaats aanvullen |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/opengraph-image` | Gegenereerd uit config en content |

Technische noot: Next.js kent geen dynamisch segment met vast voorvoegsel (`dakdekker-[plaats]`). Oplossing: een root-level `[slug]`-route die alleen de slugs `dakdekker-<plaats>` uit de config genereert (`dynamicParams = false`), al het andere geeft 404.

## 4. Techniek

- Next.js (laatste stabiele, App Router), React, TypeScript strict, Tailwind CSS v4 met design tokens als CSS-variabelen.
- `output: "standalone"`, `trailingSlash: true` (URL's blijven gelijk aan de huidige).
- Zod voor validatie (één schema, gedeeld door client en server), React Hook Form voor het stappenformulier.
- Mail: één `sendMail()`-interface met twee adapters, Nodemailer (SMTP) en Resend, gekozen via `MAIL_PROVIDER`.
- Turnstile + honeypot + minimale invultijd; server-side controle van bestandstype (magic bytes), aantal en grootte.
- Sharp-script voor de fotomigratie; Vitest voor tests; eigen link-checker-script; ESLint.
- Geen CMS, geen database, geen cookies. Plausible of Umami via env.

**Mappenstructuur**

```
config/site.ts            alles wat per dakdekker verschilt
content/                  services/ projects/ places/ faq.ts reviews.ts
src/app/                  routes
src/components/           layout/ sections/ forms/ ui/
src/lib/pricing/          rekenmodule (puur, getest)
src/lib/quote/            QuoteRequest-type, schema's, mailtemplates
src/lib/seo/              metadata- en JSON-LD-helpers
public/images/            gemigreerde foto's
scripts/                  migrate-images, check-prices, check-links
```

**`config/site.ts`** bevat: bedrijf (naam, logo, eigenaar, KvK, btw, adres), contact (telefoon, WhatsApp, e-mail), openingstijden, spoed aan/uit, socials, Google-review (score, aantal, url — `null` = niet tonen), USP's, kerncijfers, merken, garantie, actieve diensten, prijzen met `confirmed: boolean`, werkgebied, feature-flags (calculator, reviews, voor/na, WhatsApp, spoed), analytics. Elke onbekende waarde is `null` of een `TODO("aanleveren door klant")`-markering; componenten tonen een sectie alleen als de data er is. Kleuren staan als tokens in één CSS-bestand waar de config naar verwijst.

De code leest overal uit deze config en uit `/content`, nergens staat een bedrijfsnaam hard in een component. Dat is de multi-tenant-voorbereiding; meer wordt er nu niet gebouwd.

## 5. Contentmodel

```ts
Service      { slug, title, category, enabled, shortDescription, intro, whenNeeded[],
               process[], materials[], brands[], priceIds[], faq[], related[], seo, image }
Project      { slug, title, serviceSlugs[], place, year?, summary, workDone[], materials[],
               duration?, images[{src, alt, w, h}], beforeAfter?, legacyUrl, seo }
Place        { slug, name, region, intro, localInfo, projectSlugs[], nearby[], seo }
FaqItem      { question, answer, serviceSlug? }
Review       { author, rating, text, date, source: "google", url }   // start leeg
PriceItem    { id, serviceSlug, label, unit: "m2" | "m1" | "stuk" | "vast",
               fromPriceInclVat: number | null, confirmed: boolean, min?, max? }
QuoteRequest { id, createdAt, source: "offerte" | "calculator" | "terugbel" | "contact",
               services[], roofType, urgent, address{postcode, houseNumber, street?, city?},
               description, photos[], contact{name, phone, email, preferredMoment},
               estimate?: { lines[], totalInclVat }, consent{privacy, at} }
```

**Rekenmodule** (`src/lib/pricing`): pure functies `calculateEstimate(selection, priceList) → { lines, subtotal, vat, total, hasOnRequestItems }`. Geen React, geen config-import; de prijslijst gaat erin als argument. Zo is hij later herbruikbaar voor de dakconfigurator.

**Build-check prijzen**: `scripts/check-prices.ts` draait vóór `next build`, waarschuwt bij elke `confirmed: false` en laat de build falen als `REQUIRE_CONFIRMED_PRICES=true` (zo in te stellen voor productie).

## 6. Componenten

- **Layout**: SkipLink, TopBar, Header, MegaMenu (toetsenbord-bedienbaar, op mobiel een uitklapmenu), Footer, MobileActionBar, Breadcrumbs.
- **Secties**: Hero, UspList, BrandBar, KeyFigures, AboutTeaser, ServiceCards, ServiceGroups, PriceCalculator, PriceTable, ProcessSteps, ProjectHighlights, BeforeAfterSlider, Reviews, GoogleScore, ServiceArea, FaqAccordion (`<details>`), CallbackSection, CtaBand.
- **Formulieren**: QuoteForm (3 stappen + voortgang), CallbackForm, ContactForm, PhotoUpload, PostcodeLookup, Turnstile, gedeelde velden met foutmeldingen via `aria-describedby`.
- **UI**: Button, Container, Section, Card, Badge, Icon (eigen inline SVG-set), Lightbox (`<dialog>`), Reveal (scroll-animatie, uit bij `prefers-reduced-motion`), JsonLd.

Eén formulierbasis voor alle formulieren: het terugbel- en contactformulier zijn deelverzamelingen van `QuoteRequest`.

## 7. Redirects (301 tenzij anders vermeld)

| Oud | Nieuw |
|---|---|
| `/nieuwbouw/` | `/projecten/nieuwbouw-zutphen/` |
| `/nieuwbouw-schuytgraaf/` | `/projecten/nieuwbouw-schuytgraaf-arnhem/` |
| `/renovatie-elst/` | `/projecten/dakrenovatie-elst/` |
| `/home/`, `/home-two/`, `/home-four/`, `/sample-page/` | `/` |
| `/services-details/` | `/diensten/` |
| `/project-details/` | `/projecten/` |
| `/team/`, `/team-details/` | `/over-ons/` |
| 11 demo-blogposts, `/blog/`, `/category/*`, `/tag/*`, `/author/*`, `/elementor-hf/*` | **410 Gone** (Engelstalige thema-demo, geen waarde; niet naar home sturen) |
| `/feed/`, `/comments/feed/`, `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/*` | 410 |
| `/wp-content/uploads/*` | 410 (foto's krijgen nieuwe namen; oude Google Images-verwijzingen vervallen) |
| `/wp-sitemap.xml` | `/sitemap.xml` |

`/over-ons/`, `/diensten/`, `/projecten/` en `/contact/` houden hun URL en hebben geen redirect nodig.

## 8. Design-richting

**Karakter**: ambachtelijk-modern. Rustig, veel wit, grote werkfoto's, strakke lijnen die aan panlatten en daklijnen doen denken. Geen stockfoto's, geen decoratieve vormen.

**Kleur** (definitieve waarden worden in fase 2 uit het logo gemeten en als tokens vastgelegd):

| Token | Richting | Gebruik |
|---|---|---|
| `ink` | bijna-zwart antraciet (uit het logo) | koppen, tekst, topbalk, footer |
| `brand` | Evers-oranje ±`#F0541E` | accenten, iconen, grote vlakken, knop met donkere tekst |
| `brand-strong` | donkerder gebrand oranje | links en knoppen met witte tekst |
| `sand` | warm gebroken wit | afwisselende sectie-achtergrond |
| `line`, `muted` | warme grijzen | randen, bijtekst |

Het logo-oranje haalt op wit geen 4,5:1 contrast. Daarom wordt het nooit als kleur voor lopende tekst gebruikt, en krijgen knoppen óf donkere tekst op oranje óf witte tekst op `brand-strong`. Elke combinatie wordt tegen WCAG AA getoetst.

**Typografie**: koppen in een stevige grotesk (voorstel: Archivo, 700/800), lopende tekst in Inter. Beide zelf gehost via `next/font`, dus geen verzoek naar Google.

**Beeld**: de bestaande projectfoto's, opnieuw uitgesneden en geoptimaliseerd (AVIF/WebP). Veel foto's zijn staand; de hero krijgt op mobiel een staande uitsnede en op desktop een tekst-naast-foto-opzet, zodat er niets wordt uitgerekt.

**Beweging**: korte fade/slide bij scroll, geen parallax, volledig uit bij `prefers-reduced-motion`.

## 9. Fasering en oplevering

Fasen 2 t/m 10 zoals in de masterprompt. Na elke fase draaien `npm run lint`, `npm run typecheck` en `npm run build`, en meld ik de uitkomst. Lighthouse, link-check en toegankelijkheid in fase 10; de lijst met alle klant-placeholders komt als `TODO-KLANT.md` en wordt per fase bijgewerkt.

## 10. Aannames

- npm als package manager; `git init` bij de start van fase 2, één commit per fase.
- Mail standaard via SMTP, Resend als alternatief via env.
- Statistieken: Plausible-script, alleen geladen als het domein in env staat (Umami kan met dezelfde env-opzet).
- Kaart op contact en werkgebied: statische, zelf getekende SVG-kaart van de regio met de plaatsen als punten. Geen Google Maps, dus geen cookies en geen externe verzoeken.
- WhatsApp-knop gebruikt het bekende 06-nummer, achter een feature-flag.
- Voor/na-schuif wordt gebouwd maar staat uit zolang er geen echte voor/na-paren zijn.
- Reviews- en kerncijfer-secties worden gebouwd maar blijven onzichtbaar tot er echte data is.
- Privacyverklaring en algemene voorwaarden: ik lever een opzet met placeholders; de klant (of een jurist) moet de inhoud vaststellen.
- Voorbeeldprijzen in de calculator zijn fictief, zichtbaar gemarkeerd in de code en geblokkeerd door de build-check.

## 11. Open vragen

Voor de klant (blokkeren de bouw niet, alles start als placeholder):

1. Vestigingsplaats bij Anna Blamanstraat 10, postcode, KvK- en btw-nummer.
2. Naam en foto van de eigenaar, eventueel team.
3. Logo als vectorbestand (SVG/AI/EPS). Anders teken ik het in fase 2 na als SVG.
4. Aantal jaren ervaring, garantietermijnen, VCA-variant en certificaatnummer.
5. Openingstijden, spoedbereikbaarheid ja/nee.
6. Google-bedrijfsprofiel (link, score, aantal reviews).
7. Welke van de 8 extra diensten aan mogen, en de merken naast Koramic en Velux.
8. Vanaf-prijzen per dienst.
9. Per project: wat is er gedaan, materialen, duur, jaar. En of er voor/na-foto's zijn.
10. Werkgebied: welke plaatsen, en of Arnhem een eigen pagina krijgt.
11. Gewenst e-mailadres (advies: info@ op het eigen domein).

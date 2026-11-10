# Masterprompt – Nieuwe website Dakdekkersbedrijf Evers Totaal Montage

## Rol en doel

Je bent een senior full-stack developer en conversiegerichte webdesigner. Je bouwt een nieuwe website voor **Dakdekkersbedrijf Evers Totaal Montage** ter vervanging van de huidige WordPress/Elementor-site op https://dakdekkersbedrijfeverstotaalmontage.nl/.

Het doel is een top-notch dakdekkerswebsite die:
1. bezoekers omzet in offerte-aanvragen en telefoontjes,
2. lokaal goed scoort in Google,
3. vertrouwen uitstraalt (echte projecten, reviews, garantie, vakmanschap),
4. technisch de basis vormt voor een latere 3D-dakconfigurator en een dakdekkersplatform (SaaS).

## Werkwijze (belangrijk)

- Werk **stap voor stap**. Begin met een plan en laat het plan eerst goedkeuren voordat je code schrijft.
- Lever per fase op, en controleer na elke fase: `npm run lint`, `npm run typecheck`, `npm run build` moeten foutloos zijn.
- Stel vragen als iets onduidelijk is, in plaats van te gokken.
- **Verzin geen feiten over het bedrijf.** Reviews, aantallen projecten, jaren ervaring, prijzen, garantietermijnen, KvK, adres, openingstijden, namen van medewerkers: alles wat niet hieronder staat komt in een centraal configbestand als duidelijke placeholder (`TODO: aanleveren door klant`). Geen nepreviews, geen verzonnen statistieken.
- Schrijf alle website-teksten in het Nederlands, in de u-vorm, helder en zonder holle marketingtaal. Concreet en vakkundig.

## Voorbeeld en benchmark

Gebruik **https://macodakonderhoud.nl/** als benchmark voor structuur, conversie-elementen en kwaliteitsniveau. Bekijk die site zelf goed.

Neem over als **concept** (niet kopiëren):
- topbalk met noodbereikbaarheid, Google-score, telefoon
- mega-menu met diensten gegroepeerd per categorie
- hero met echte werkfoto, duidelijke belofte, USP-lijst, twee CTA's (offerte + bellen) en Google-score
- offerteformulier in 3 stappen, al in of direct onder de hero
- merkenbalk (fabrikanten en VCA)
- kerncijfers (alleen echte cijfers)
- "over ons" met foto en naam van de eigenaar
- dienstkaarten met indicatieve vanaf-prijzen
- prijscalculator met vanaf-prijzen die doorlinkt naar de offerte-aanvraag
- stappenplan (3–4 stappen)
- projecten met voor/na-schuifvergelijking
- reviews uit Google
- werkgebied met plaatsnaampagina's
- veelgestelde vragen
- terugbelformulier
- complete footer met NAW, KvK, openingstijden, privacybeleid, sitemap
- vaste mobiele actiebalk (bellen / offerte / WhatsApp)
- `llms.txt`

**Niet doen:** teksten, afbeeldingen, logo's, kleuren of huisstijl van MACO kopiëren. Evers krijgt een eigen identiteit.

## Wat er mis is met de huidige site (oplossen)

- Spoed-telefoonknop op /contact/ linkt naar `tel:0123456789` in plaats van het echte nummer.
- Icoontjes en afbeeldingen worden geladen vanaf de demo-site van het thema (`themedox.com/roofx`).
- Dode links: Algemene voorwaarden, footer-credit en merk-logo's linken naar `#`.
- Dubbele H2-koppen per dienst op /diensten/.
- Alle 6 diensten linken naar dezelfde pagina; geen losse dienstpagina's.
- Projectpagina's bevatten alleen foto's, geen tekst; twee projecten hebben dezelfde titel ("Nieuwbouw – Zutphen").
- Drie verschillende formulieren (home, diensten, contact) met verschillende velden.
- Geen meta descriptions, generieke titels zonder dienst/plaats, geen structured data.
- Geen privacyverklaring, geen algemene voorwaarden, geen KvK, geen adres in tekst, geen werkgebied, geen openingstijden.
- Geen reviews, geen uitleg bij VCA of garantie, geen eigenaar/team zichtbaar.
- Mailadres is `@outlook.com` (advies: info@ op eigen domein; in config instelbaar).
- Copyright-jaar staat vast op 2025.

## Bekende bedrijfsgegevens (rest = placeholder)

- Naam: Dakdekkersbedrijf Evers Totaal Montage
- Telefoon: +31 6 27289738
- E-mail (huidig): everstotaalmontage@outlook.com
- Adres (uit kaart op huidige site, laten bevestigen): Anna Blamanstraat 10 — plaats onbekend
- Bekende projecten: Nieuwbouw Zutphen, Nieuwbouw Schuytgraaf, Renovatie Elst
- Huidige diensten: dakrenovaties, platte daken, schoorsteenrenovaties, lood- en zinkwerk, timmerwerk, Velux dakramen
- Kenmerken genoemd op huidige site: meer dan 10 jaar ervaring, VCA, werkt met o.a. Koramic (logo), garantie op werkzaamheden
- Huidige logo's: `wp-content/uploads/2025/02/Evers.png` en `cropped-Evers-1.png`

Mogelijke extra diensten (eerst met klant checken, standaard uit via config): daklekkage/dakreparatie (incl. spoed), dakinspectie, dakisolatie, dakgoten, nokvorsten, stormschade, nieuwbouw, zakelijk dakwerk.

## Techniek

- **Next.js (App Router, laatste stabiele versie), TypeScript strict, Tailwind CSS.**
- Statisch waar het kan (SSG), server actions/route handlers voor formulieren.
- Content in getypte TypeScript/MDX-bestanden in de repo (`/content`): diensten, projecten, plaatsen, FAQ, reviews. Nog geen CMS.
- **Eén centraal configbestand** (`/config/site.ts`) met bedrijfsnaam, logo, kleuren, contactgegevens, openingstijden, KvK, socials, Google-reviewscore, actieve diensten, prijzen, werkgebied, feature-flags. Ontwerp dit zo dat dezelfde codebase later voor andere dakdekkers te gebruiken is (multi-tenant voorbereiding), maar bouw nu géén multi-tenant.
- Afbeeldingen via `next/image`, AVIF/WebP, juiste `sizes`, beschrijvende Nederlandse `alt`-teksten en bestandsnamen.
- Formulieren: validatie met Zod (client + server), honeypot + Cloudflare Turnstile tegen spam, foto-upload (max. 5 foto's, max. 10 MB per stuk, alleen jpg/png/heic/webp), versturen per mail via SMTP of Resend (instelbaar via env), bevestigingsmail naar de klant. Geen gegevens loggen in de console.
- Statistieken: Plausible of Umami (cookieloos), zodat er geen cookiebanner nodig is.
- Hosting: eigen Hetzner-VPS. Lever een `Dockerfile` (Next.js standalone output) en een korte `DEPLOY.md`.
- `.env.example` met alle benodigde variabelen.

## Design

- Eigen, sterke identiteit: betrouwbaar, vakkundig, ambachtelijk-modern. Baseer kleuren op het bestaande Evers-logo (haal het logo op en leid de primaire kleur af; leg kleuren vast als design tokens).
- Grote, echte werkfoto's (eerst de bestaande projectfoto's van de huidige site), veel witruimte, duidelijke typografie (bijv. een stevige sans-serif voor koppen).
- Subtiele animaties (fade/slide bij scroll, respecteer `prefers-reduced-motion`).
- Mobile-first: het grootste deel van de bezoekers komt via mobiel.
- Toegankelijk: WCAG 2.2 AA, skip-link, focus-states, juiste kopstructuur (één H1 per pagina), contrast.

## Sitemap

```
/                               Home
/diensten/                      Overzicht, gegroepeerd per categorie
/diensten/[slug]/               Per dienst een eigen pagina
/projecten/                     Overzicht met filter per dienst
/projecten/[slug]/              Per project
/werkgebied/                    Overzicht met kaart
/dakdekker-[plaats]/            Plaatsnaampagina's
/prijzen/                       Vanaf-prijzen + calculator
/offerte-aanvragen/             Offerteformulier (3 stappen)
/over-ons/
/veelgestelde-vragen/
/contact/
/privacyverklaring/
/algemene-voorwaarden/
/bedankt/                       Na versturen formulier
```

## Pagina-eisen

**Home** (in deze volgorde):
1. Topbalk: spoed-bereikbaarheid (als actief), Google-score, telefoon, e-mail
2. Header met logo, mega-menu diensten, CTA "Offerte aanvragen" en telefoonknop
3. Hero: echte werkfoto, H1 met dienst + regio, korte belofte, USP-lijst (uit config), CTA's offerte + bellen, Google-score
4. Offerteformulier stap 1 direct zichtbaar (in of onder hero)
5. Merkenbalk (fabrikanten + VCA)
6. Kerncijfers (alleen tonen als ingevuld in config)
7. Over ons kort, met foto en naam eigenaar
8. Diensten als kaarten (met vanaf-prijs als ingevuld)
8b. Prijscalculator "Wat kost uw dak?"
9. Stappenplan: advies/inspectie → offerte → uitvoering → oplevering & garantie
10. Projecten-highlight + voor/na-slider
11. Reviews
12. Werkgebied
13. FAQ (accordeon)
14. Terugbelformulier + afsluitende CTA
15. Footer

**Dienstpagina** (template, per dienst unieke inhoud):
- H1, intro, wanneer heeft u dit nodig, onze werkwijze, materialen/merken, vanaf-prijs (optioneel), gerelateerde projecten, dienst-specifieke FAQ, CTA naar offerte met deze dienst al geselecteerd, interne links naar verwante diensten.
- Minimaal ~500 woorden unieke, bruikbare tekst. Geen opvulling.

**Projectpagina**:
- Titel met type werk + plaats, korte omschrijving, wat er gedaan is, materialen, duur (als bekend), fotogalerij met lightbox, voor/na-slider als beschikbaar, CTA, gerelateerde projecten.

**Plaatsnaampagina's**:
- Alleen voor plaatsen die in config staan (eerst: Elst, Zutphen en de plaats van het bedrijfsadres; rest later aanvullen).
- Elke pagina moet echt unieke inhoud hebben (lokale projecten, regio-specifieke informatie). Geen doorway pages met alleen een andere plaatsnaam. Liever weinig goede pagina's dan veel dunne.

**Prijzen/calculator**:
- De calculator hoort standaard bij de site en is zichtbaar op home (sectie "Wat kost uw dak?") en op `/prijzen/`.
- Vanaf-prijzen en eenheden (per m², per m¹, per stuk) komen uit config. Gebruik tijdens de bouw duidelijk gemarkeerde voorbeeldprijzen (`TODO: prijs bevestigen door klant`). Voeg een build-check toe die waarschuwt zolang er nog onbevestigde prijzen in de config staan, zodat er niet per ongeluk voorbeeldprijzen live gaan.
- Een dienst zonder ingevulde prijs toont "Prijs op aanvraag" in plaats van een bedrag.
- Klant kiest werkzaamheden, vult maten in, ziet een indicatie incl. btw, en kan met één klik een offerte aanvragen met die gegevens vooringevuld.
- Duidelijke disclaimer dat het een indicatie is en dat de definitieve prijs na inspectie volgt.
- Bouw de rekenlogica als losse, geteste module: dit wordt later de basis van de dakconfigurator.

**Offerteformulier (3 stappen)**:
1. Uw klus: één of meer diensten (gegroepeerd), type dak (hellend, plat, schilddak, anders), spoed ja/nee
2. Details: adres (postcode + huisnummer, plaats automatisch aanvullen als dat zonder betaalde API kan), omschrijving, foto's uploaden
3. Gegevens: naam, telefoon, e-mail, voorkeur contactmoment, akkoord privacyverklaring
- Voortgangsindicator, opslaan tussen stappen (in state), duidelijke foutmeldingen, toegankelijk.
- Na versturen naar `/bedankt/` met verwachting over reactietijd.
- Verstuur een nette HTML-mail naar het bedrijf met alle gegevens en foto's als bijlage.
- Structuur de data alsof het later in een database/dashboard terechtkomt (één `QuoteRequest`-type).

**Contact**: echt telefoonnummer (fix van de huidige bug), e-mail, adres, openingstijden, kaart (lazy-loaded, of statische kaart om privacy en snelheid te sparen), kort formulier.

**Over ons**: verhaal van de eigenaar, team, VCA en garantie concreet uitgelegd, merken waarmee gewerkt wordt, CTA.

## SEO

- Per pagina unieke `title` (patroon: `[Dienst] [plaats] | Evers Totaal Montage`) en `meta description`, canonical, Open Graph en Twitter-card met eigen OG-afbeelding.
- Structured data (JSON-LD): `RoofingContractor`/`LocalBusiness` (NAW, telefoon, openingstijden, werkgebied, `aggregateRating` alleen als echte data in config), `Service` per dienst, `FAQPage`, `BreadcrumbList`.
- `sitemap.xml`, `robots.txt`, `llms.txt`.
- Breadcrumbs op alle subpagina's.
- Logische interne links tussen diensten, projecten en plaatsen.
- **301-redirects** van alle oude URL's:
  - `/over-ons/` → `/over-ons/`
  - `/diensten/` → `/diensten/`
  - `/projecten/` → `/projecten/`
  - `/contact/` → `/contact/`
  - `/nieuwbouw/` → nieuwe projectpagina Nieuwbouw Zutphen
  - `/nieuwbouw-schuytgraaf/` → nieuwe projectpagina Nieuwbouw Schuytgraaf
  - `/renovatie-elst/` → nieuwe projectpagina Renovatie Elst
  - `/wp-content/*`, `/wp-admin/*`, `/feed/` → passend afvangen
  - Controleer de huidige site (en `/wp-sitemap.xml` als die bestaat) op meer URL's en neem die mee.

## Migratie van content

- Haal de bruikbare projectfoto's en het logo op van de huidige site (`/wp-content/uploads/2025/02/...`), optimaliseer ze en sla ze lokaal op met beschrijvende namen.
- **Neem niets over van `themedox.com`.**
- Herschrijf de bestaande teksten: korter, concreter, zonder herhaling.
- Maak per bestaand project een content-bestand met placeholders voor omschrijving, materialen en duur.

## Performance en kwaliteit (acceptatiecriteria)

- Lighthouse mobiel: Performance ≥ 95, Accessibility ≥ 95, Best Practices 100, SEO 100.
- LCP < 2,0 s, CLS < 0,05 op mobiel.
- Geen console-errors, geen dode links (controleer met een link-checker script).
- Unit tests voor de prijsberekening en formuliervalidatie (Vitest).
- Werkt in de laatste versies van Chrome, Safari (iOS) en Firefox.

## Fasering

1. **Plan**: analyseer de huidige site en macodakonderhoud.nl, lever een plan met sitemap, componentenlijst, contentmodel en design-richting. Wacht op akkoord.
2. **Fundament**: project-setup, config, design tokens, layout (header, mega-menu, footer, mobiele actiebalk), basiscomponenten.
3. **Home**.
4. **Diensten** (overzicht + template + content).
5. **Projecten** (overzicht + template + migratie foto's).
6. **Offerteformulier + terugbelformulier + mail**.
7. **Over ons, contact, FAQ, werkgebied en plaatsnaampagina's, privacy, voorwaarden, bedankt**.
8. **Prijzen/calculator** (met voorbeeldprijzen tot de klant ze bevestigt).
9. **SEO**: metadata, JSON-LD, sitemap, robots, llms.txt, redirects.
10. **Kwaliteit**: tests, Lighthouse, toegankelijkheid, link-check, Dockerfile en `DEPLOY.md`.

Sluit af met een lijst van alle placeholders (`TODO: aanleveren door klant`) zodat duidelijk is wat de klant nog moet aanleveren.

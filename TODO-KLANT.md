# Aan te leveren door de klant

Bijgewerkt na fase 8. Elk punt staat in de code als `TODO: aanleveren door klant`
(zoek op die tekst). Tot een punt is ingevuld toont de site dat onderdeel niet.

## Bedrijfsgegevens (`config/site.ts`)

- [ ] Statutaire naam volgens KvK
- [ ] KvK-nummer en btw-nummer
- [ ] Adres bevestigen: Anna Blamanstraat 10, plus postcode, plaats en provincie
- [ ] Openingstijden
- [ ] Spoedbereikbaarheid: ja/nee, en op welke tijden
- [ ] Bevestigen dat 06 27 28 97 38 ook via WhatsApp bereikbaar is
- [ ] E-mailadres op eigen domein (advies: info@), nu nog het outlook.com-adres
- [ ] Links naar Facebook, Instagram en LinkedIn (indien aanwezig)

## Eigenaar en team

- [ ] Naam, functie en portretfoto van de eigenaar

## Vertrouwen

- [ ] Google-bedrijfsprofiel: link, score en aantal reviews
- [ ] Kerncijfers: jaren ervaring en aantal projecten (alleen echte cijfers)
- [ ] VCA: welke variant en het certificaatnummer
- [ ] Garantietermijnen per soort werk
- [ ] Merken bevestigen: Koramic, Monier, Kingspan Unidek en Keralit (staan als logo op de huidige site) en VELUX. Aanvullen waar nodig, met logo-bestanden die gebruikt mogen worden; tot dan staan de merken als naam op de site.

## Diensten en werkgebied

- [ ] Welke extra diensten mogen aan: daklekkage/dakreparatie, dakinspectie, dakisolatie, dakgoten, nokvorsten, stormschade, nieuwbouw, zakelijk dakwerk
- [ ] Omschrijving van het werkgebied en de plaatsen die een eigen pagina krijgen (nu: Elst, Zutphen, Arnhem)
- [ ] Regio voor in de hoofdkop van de homepage (bijv. "regio Arnhem")

## Huisstijl

- [ ] Logo als vectorbestand (SVG, AI of EPS). Nu staat er een natekening van het 160 px-logo in `src/components/layout/Logo.tsx`; die graag laten goedkeuren.

## Projecten (`content/projects.ts`)

Per project (Nieuwbouw Zutphen, Nieuwbouw Schuytgraaf Arnhem, Dakrenovatie Elst):

- [ ] Omschrijving, wat er gedaan is, gebruikte materialen, duur en jaar
- [ ] Welke diensten er zijn uitgevoerd
- [ ] Echte voor/na-foto's vanuit hetzelfde standpunt (dan gaat de voor/na-schuif aan)

## Foto's

- [ ] Toestemming van herkenbare personen op de werkfoto's (twee foto's van Schuytgraaf en de foto van de dakdekker met helm)
- [ ] Alt-teksten laten nalezen: ze beschrijven wat ik op de foto's zie (`scripts/migrate-images.mjs`)

## Teksten

- [ ] Antwoorden bij de veelgestelde vragen laten nalezen (`content/faq.ts`)
- [ ] Reactietijd na een aanvraag (voor de FAQ en de bedankpagina)
- [ ] Google-reviews om over te nemen (`content/reviews.ts`)

## Dienstpagina's (`content/services/`)

- [ ] Teksten van de zes dienstpagina's laten nalezen. De vakinhoud is algemeen; graag controleren of de beschreven werkwijze klopt met hoe Evers werkt (bijv. dak elke werkdag waterdicht, lood in korte stroken, afval afvoeren).
- [ ] Platte daken: met welke dakbedekking wordt gewerkt (bitumen, EPDM of beide)?
- [ ] VELUX dakramen: verzorgt Evers ook de binnenafwerking, en klopt "doorgaans binnen een dag geplaatst"?
- [ ] Foto van een gerenoveerde schoorsteen (de pagina Schoorsteenrenovatie heeft nog geen foto)
- [ ] Passender foto's voor Platte daken en Timmerwerk (nu de best beschikbare foto's uit het project Elst)

## Formulieren en mail

- [ ] Mailgegevens voor het verzenden: SMTP-server of Resend-account, en een afzenderadres op het eigen domein (zie `.env.example`). Zonder deze gegevens kunnen de formulieren in productie niet verzenden.
- [ ] Op welk adres moeten aanvragen binnenkomen (nu het outlook.com-adres)?
- [ ] Cloudflare Turnstile-sleutels (gratis Cloudflare-account) voor de spambeveiliging
- [ ] Reactietijd na een aanvraag, voor de bedankpagina en de bevestigingsmail
- [ ] Tekst van de bevestigingsmail laten nalezen (`src/lib/mail/templates.ts`)

## Overige pagina's

- [ ] Over ons: het verhaal van de eigenaar en het team (de sectie verschijnt zodra de naam van de eigenaar in de config staat)
- [ ] Over ons: de drie uitgangspunten onder "Zo werken wij" laten nalezen
- [ ] Plaatsnaampagina's (Elst, Zutphen, Arnhem): teksten laten nalezen en aanvullen met eigen ervaring per plaats (`content/places.ts`)
- [ ] Privacyverklaring laten controleren door de klant of een jurist; bewaartermijn voor aanvragen vaststellen; hostingpartij en mailprovider invullen
- [ ] Algemene voorwaarden aanleveren (tekst of pdf). Tot dan verwijst de pagina naar opvragen per telefoon of mail en wordt ze niet geïndexeerd.

## Prijzen en calculator (`config/site.ts`, onderdeel `pricing`)

Alle twaalf bedragen in de config zijn **voorbeeldprijzen**, alleen om de calculator te kunnen bouwen en testen.
Ze staan in de code als `TODO: prijs bevestigen door klant`. Zolang een prijs niet bevestigd is, staat op de
live site "Prijs op aanvraag", is de calculator verborgen en wordt /prijzen/ niet geïndexeerd.

- [ ] Per regel de echte vanaf-prijs inclusief btw (of "geen prijs"), daarna `confirmed: true`
- [ ] Lijst met werkzaamheden controleren: kloppen de twaalf regels, mist er werk, moet er iets af?
- [ ] Wat zit er in een vanaf-prijs: steiger, afvoer van oud materiaal, voorrijkosten?
- [ ] Minimumbedrag per klus, als dat er is (de calculator kan ermee rekenen)
- [ ] Btw: bevestigen dat overal 21% geldt
- [ ] Tekst "Wat bepaalt de prijs van uw dak?" op /prijzen/ laten nalezen

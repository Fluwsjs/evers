import type { SiteConfig } from "./types";

/**
 * Centrale configuratie van de site.
 *
 * Verzin hier niets. Wat de klant nog niet heeft aangeleverd of bevestigd
 * staat op `null` met de opmerking `TODO: aanleveren door klant`.
 * Zoek op die tekst voor de volledige lijst.
 */
export const site: SiteConfig = {
  name: "Dakdekkersbedrijf Evers Totaal Montage",
  shortName: "Evers Totaal Montage",
  legalName: null, // TODO: aanleveren door klant (statutaire naam volgens KvK)
  tagline: "Dakdekker voor renovatie en nieuwbouw",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dakdekkersbedrijfeverstotaalmontage.nl",
  locale: "nl-NL",

  owner: {
    name: null, // TODO: aanleveren door klant (naam eigenaar)
    role: null, // TODO: aanleveren door klant (functie, bijv. "Eigenaar en dakdekker")
    photo: null, // TODO: aanleveren door klant (portretfoto eigenaar)
  },

  contact: {
    phone: "+31627289738",
    phoneDisplay: "06 27 28 97 38",
    whatsapp: "31627289738", // TODO: aanleveren door klant (bevestigen dat dit nummer WhatsApp gebruikt)
    // Advies: info@ op het eigen domein. Hier aanpassen zodra dat adres bestaat.
    email: "everstotaalmontage@outlook.com",
  },

  address: {
    street: "Anna Blamanstraat 10", // Uit de kaart op de oude site; nog niet bevestigd.
    postalCode: null, // TODO: aanleveren door klant
    city: null, // TODO: aanleveren door klant (vestigingsplaats)
    region: null, // TODO: aanleveren door klant (provincie)
    country: "NL",
    confirmed: false, // TODO: aanleveren door klant (adres bevestigen)
  },

  registration: {
    kvk: null, // TODO: aanleveren door klant
    vat: null, // TODO: aanleveren door klant
  },

  openingHours: null, // TODO: aanleveren door klant

  emergency: {
    enabled: false, // TODO: aanleveren door klant (is er spoedbereikbaarheid, en wanneer?)
    label: "Bereikbaar bij spoed",
  },

  socials: {
    facebook: null, // TODO: aanleveren door klant
    instagram: null, // TODO: aanleveren door klant
    linkedin: null, // TODO: aanleveren door klant
  },

  googleReviews: null, // TODO: aanleveren door klant (link Google-bedrijfsprofiel, score, aantal reviews)

  // Alleen wat op de huidige site staat. Aanvullen na overleg met de klant.
  usps: [
    "Vrijblijvende offerte",
    "VCA-gecertificeerd",
    "Garantie op onze werkzaamheden",
    "Renovatie én nieuwbouw",
  ],

  keyFigures: [], // TODO: aanleveren door klant (jaren ervaring, aantal projecten: alleen echte cijfers)

  brands: [
    // De eerste vier staan als logo op de huidige site; VELUX volgt uit de dienst dakramen.
    // Logo's worden pas getoond als de klant bestanden aanlevert die gebruikt mogen worden.
    { name: "Koramic", logo: null, url: null }, // TODO: aanleveren door klant (logo met toestemming)
    { name: "Monier", logo: null, url: null }, // TODO: aanleveren door klant (logo met toestemming)
    { name: "Kingspan Unidek", logo: null, url: null }, // TODO: aanleveren door klant (logo met toestemming)
    { name: "Keralit", logo: null, url: null }, // TODO: aanleveren door klant (logo met toestemming)
    { name: "VELUX", logo: null, url: null }, // TODO: aanleveren door klant (logo met toestemming)
    // TODO: aanleveren door klant (lijst met merken bevestigen en aanvullen)
  ],

  certifications: [
    {
      name: "VCA",
      description: null, // TODO: aanleveren door klant (welke VCA-variant)
      number: null, // TODO: aanleveren door klant (certificaatnummer)
    },
  ],

  warranty: {
    summary: "Garantie op onze werkzaamheden",
    terms: [], // TODO: aanleveren door klant (garantietermijnen per soort werk)
  },

  services: {
    categories: [
      {
        id: "renovatie",
        title: "Renovatie & nieuwbouw",
        description: "Een nieuw of vernieuwd dak, hellend of plat.",
      },
      {
        id: "reparatie",
        title: "Reparatie & onderhoud",
        description: "Lekkage, schade en periodieke controle.",
      },
      {
        id: "specialistisch",
        title: "Schoorsteen, lood & zink",
        description: "De details die een dak waterdicht houden.",
      },
      {
        id: "aanvullend",
        title: "Timmerwerk & dakramen",
        description: "Houtwerk rond het dak en meer daglicht.",
      },
    ],
    // De zes diensten van de huidige site. Extra diensten staan klaar in
    // /content/services.ts en gaan aan door de slug hier toe te voegen.
    // TODO: aanleveren door klant (welke extra diensten mogen aan)
    enabled: [
      "dakrenovatie",
      "platte-daken",
      "schoorsteenrenovatie",
      "lood-en-zinkwerk",
      "timmerwerk",
      "velux-dakramen",
    ],
  },

  serviceArea: {
    summary: null, // TODO: aanleveren door klant (omschrijving werkgebied)
    regionLabel: null, // TODO: aanleveren door klant (regio voor in de hoofdkop, bijv. "regio Arnhem")
    // Plaatsen waar projecten zijn uitgevoerd. De vestigingsplaats komt erbij zodra die bekend is.
    places: ["elst", "zutphen", "arnhem"], // TODO: aanleveren door klant (vestigingsplaats en overige plaatsen)
  },

  /**
   * Vanaf-prijzen voor de dienstpagina's, de prijzenpagina en de calculator.
   *
   * LET OP: alle bedragen hieronder zijn VOORBEELDPRIJZEN om de calculator te kunnen
   * bouwen en testen. Het zijn geen prijzen van het bedrijf. Zolang `confirmed` op
   * `false` staat, toont de live site "Prijs op aanvraag" en waarschuwt de build
   * (`npm run check:prices`). Zet per regel de echte prijs in en `confirmed` op `true`.
   * Een dienst zonder prijs: `fromPrice: null`.
   */
  pricing: {
    vatRate: 0.21, // TODO: aanleveren door klant (bevestigen dat overal 21% btw geldt)
    items: [
      { id: "dakpannen-vervangen", serviceSlug: "dakrenovatie", label: "Dakpannen vervangen, met nieuwe panlatten en folie", unit: "m2", fromPrice: 95, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "dakisolatie-hellend", serviceSlug: "dakrenovatie", label: "Hellend dak van buitenaf isoleren", unit: "m2", fromPrice: 60, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "plat-dak-bedekking", serviceSlug: "platte-daken", label: "Nieuwe dakbedekking op een plat dak", unit: "m2", fromPrice: 75, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "plat-dak-isolatie", serviceSlug: "platte-daken", label: "Plat dak isoleren", unit: "m2", fromPrice: 45, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "schoorsteen-voegen", serviceSlug: "schoorsteenrenovatie", label: "Schoorsteen opnieuw voegen", unit: "stuk", fromPrice: 650, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "schoorsteen-lood", serviceSlug: "schoorsteenrenovatie", label: "Lood rond de schoorsteen vervangen", unit: "stuk", fromPrice: 450, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "loodaansluiting", serviceSlug: "lood-en-zinkwerk", label: "Loodaansluiting vervangen", unit: "m1", fromPrice: 85, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "zinken-goot", serviceSlug: "lood-en-zinkwerk", label: "Zinken dakgoot vervangen", unit: "m1", fromPrice: 110, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "boeidelen", serviceSlug: "timmerwerk", label: "Boeidelen vervangen", unit: "m1", fromPrice: 90, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "dakbeschot", serviceSlug: "timmerwerk", label: "Dakbeschot vervangen", unit: "m2", fromPrice: 55, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "dakraam-plaatsen", serviceSlug: "velux-dakramen", label: "Nieuw dakraam plaatsen", unit: "stuk", fromPrice: 1250, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      { id: "dakraam-vervangen", serviceSlug: "velux-dakramen", label: "Bestaand dakraam vervangen", unit: "stuk", fromPrice: 950, minimum: null, confirmed: false }, // TODO: prijs bevestigen door klant
      // TODO: aanleveren door klant (lijst met werkzaamheden controleren, minimumbedragen per klus)
    ],
  },

  features: {
    calculator: true,
    reviews: false, // Aan zodra er echte Google-reviews in /content staan.
    beforeAfter: false, // Aan zodra er echte voor/na-foto's zijn.
    whatsapp: true,
  },
};

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

  features: {
    calculator: true,
    reviews: false, // Aan zodra er echte Google-reviews in /content staan.
    beforeAfter: false, // Aan zodra er echte voor/na-foto's zijn.
    whatsapp: true,
  },
};

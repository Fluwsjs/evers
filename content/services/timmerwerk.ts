import type { ServiceDetail } from "./types";

export const timmerwerk: ServiceDetail = {
  slug: "timmerwerk",
  heading: "Timmerwerk aan en rond uw dak",
  metaTitle: "Timmerwerk aan het dak",
  metaDescription:
    "Timmerwerk aan het dak: dakbeschot, dakconstructie, boeidelen, windveren en dakkapellen. Herstel van houtrot en onderhoudsarme bekleding. Vraag een offerte aan.",
  intro: [
    "Onder elke dakbedekking zit hout: het dakbeschot, de gordingen en sporen die het dragen, en de boeidelen en windveren die het dak aan de randen afwerken. Is dat hout aangetast, dan heeft nieuwe dakbedekking weinig zin.",
    "Omdat wij het timmerwerk zelf doen, hoeft u bij een dakrenovatie geen tweede partij in te schakelen. Wij herstellen wat we tegenkomen en maken nieuw werk, van een stuk dakbeschot tot de bekleding van een dakkapel.",
  ],
  image: "elst3",
  whenNeeded: {
    intro: "Timmerwerk aan het dak komt meestal in beeld in een van deze situaties:",
    items: [
      {
        title: "Houtrot in boeidelen of windveren",
        text: "Zacht hout, bladderende verf of zwarte plekken langs de dakrand. Vaak het gevolg van een lekkende goot erboven.",
      },
      {
        title: "Aangetast dakbeschot",
        text: "Na een langdurige lekkage is het hout onder de dakbedekking verkleurd of zacht. Dat zien we bij het openleggen van het dak.",
      },
      {
        title: "Een doorgezakte dakconstructie",
        text: "Een gording die doorbuigt of een nok die niet meer recht loopt. De constructie moet dan worden versterkt of deels vervangen.",
      },
      {
        title: "Een dakkapel die onderhoud vraagt",
        text: "Zijwangen en boeiboorden van een dakkapel staan vol in het weer en zijn lastig te schilderen.",
      },
      {
        title: "Een sparing voor een dakraam",
        text: "Voor een dakraam wordt een opening in het dak gemaakt en met een raveling opgevangen.",
      },
    ],
  },
  process: [
    {
      title: "Opnemen en beoordelen",
      text: "We bekijken hoe ver de aantasting gaat. Hout dat er aan de buitenkant goed uitziet, kan van binnen zacht zijn; dat testen we.",
    },
    {
      title: "Oorzaak wegnemen",
      text: "Houtrot heeft altijd een oorzaak: een lek, een slechte aansluiting of te weinig ventilatie. Die lossen we eerst op.",
    },
    {
      title: "Herstellen of vervangen",
      text: "Aangetast hout wordt tot in het gezonde hout weggehaald en vervangen. Constructieve delen krijgen de juiste afmetingen en bevestiging.",
    },
    {
      title: "Afwerken",
      text: "Nieuwe boeidelen, windveren of bekleding, strak gemonteerd. Daarna sluit de dakbedekking of het zinkwerk er weer op aan.",
    },
  ],
  materials: {
    intro: "Voor hout aan de buitenzijde telt vooral hoe het zich houdt in weer en wind.",
    items: [
      {
        title: "Constructiehout en dakbeschot",
        text: "Gordingen, sporen en dakplaten in de sterkte en dikte die bij de overspanning past.",
      },
      {
        title: "Duurzaam hout voor de buitenzijde",
        text: "Houtsoorten die van nature goed tegen vocht kunnen, of verduurzaamd hout. Geschilderd of onbehandeld, afhankelijk van de soort.",
      },
      {
        title: "Onderhoudsarme bekleding",
        text: "Kunststof gevelbekleding met een houtnerf voor boeidelen, windveren en dakkapellen. U hoeft het niet meer te schilderen.",
      },
      {
        title: "Ventilatie en afwerking",
        text: "Een geventileerde opbouw achter de bekleding, zodat vocht weg kan en het achterliggende hout droog blijft.",
      },
    ],
    brands: ["Keralit"],
  },
  priceFactors: [
    "De hoeveelheid hout die vervangen moet worden",
    "Constructief herstel of alleen afwerking",
    "Hout of onderhoudsarme bekleding",
    "De hoogte en of er een steiger nodig is",
    "Of het werk samenvalt met ander dakwerk",
  ],
  faq: [
    {
      serviceSlug: "timmerwerk",
      question: "Doet u ook timmerwerk dat los staat van een dakrenovatie?",
      answer:
        "Ja, zolang het met het dak te maken heeft: boeidelen, windveren, dakbeschot, dakkapellen en de constructie eronder. Voor timmerwerk binnenshuis of aan kozijnen kunt u beter bij een timmerbedrijf terecht.",
    },
    {
      serviceSlug: "timmerwerk",
      question: "Kan houtrot worden gerepareerd, of moet alles worden vervangen?",
      answer:
        "Kleine plekken in verder gezond hout kunnen worden uitgehakt en hersteld. Is een boeideel of windveer over een groot deel aangetast, dan is vervangen degelijker en vaak niet duurder.",
    },
    {
      serviceSlug: "timmerwerk",
      question: "Wat is het voordeel van onderhoudsarme bekleding?",
      answer:
        "U hoeft de dakrand en de dakkapel niet meer om de paar jaar te laten schilderen, wat op hoogte al snel een steiger vraagt. De bekleding is kleurvast en rot niet. Het uiterlijk lijkt op geschilderd hout.",
    },
  ],
  related: ["dakrenovatie", "lood-en-zinkwerk", "velux-dakramen"],
};

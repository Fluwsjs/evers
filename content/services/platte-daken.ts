import type { ServiceDetail } from "./types";

// TODO: aanleveren door klant (bevestigen met welke dakbedekkingen gewerkt wordt: bitumen, EPDM of beide)
export const platteDaken: ServiceDetail = {
  slug: "platte-daken",
  heading: "Platte daken: nieuwe dakbedekking, renovatie en onderhoud",
  metaTitle: "Platte daken",
  metaDescription:
    "Plat dak vernieuwen, renoveren of laten onderhouden. Nieuwe dakbedekking op woning, aanbouw, garage of dakkapel, met aandacht voor afschot en dakranden.",
  intro: [
    "Op een plat dak blijft water langer liggen dan op een hellend dak. De dakbedekking, de naden en de dakranden moeten dus echt dicht zijn. Wij leggen nieuwe platte daken en renoveren bestaande: op de woning, de aanbouw, de garage of de dakkapel.",
    "Een plat dak dat op tijd wordt nagekeken gaat veel langer mee. Vaak is een lekkage terug te voeren op één zwakke plek: een losse naad, een gescheurde hoek of een verstopte afvoer. Wij zoeken de oorzaak op en vertellen u of repareren nog zin heeft.",
  ],
  image: "elst7",
  whenNeeded: {
    intro: "Aan deze punten herkent u een plat dak dat aandacht nodig heeft:",
    items: [
      {
        title: "Blazen, scheuren of plooien",
        text: "Bitumen droogt uit door zon en temperatuurwisselingen. Blazen en haarscheurtjes zijn de eerste tekenen; daarna gaan naden open.",
      },
      {
        title: "Water dat blijft staan",
        text: "Plassen die na twee dagen droog weer nog niet weg zijn, wijzen op te weinig afschot of een verzakte ondergrond.",
      },
      {
        title: "Vochtplekken op het plafond",
        text: "Het water komt lang niet altijd binnen op de plek waar u de vlek ziet. Het loopt eerst een stuk mee over de dakplaat of de isolatie.",
      },
      {
        title: "Losse of gescheurde dakranden",
        text: "De opstand langs de rand en de aansluiting op de gevel krijgen het zwaarst te verduren. Hier beginnen de meeste lekkages.",
      },
      {
        title: "Een dak van twintig jaar of ouder",
        text: "Ook zonder lekkage loont het om een ouder dak te laten inspecteren, zeker voordat u er zonnepanelen op legt.",
      },
    ],
  },
  process: [
    {
      title: "Inspectie",
      text: "We controleren de dakbedekking, de naden, de dakranden, de afvoeren en het afschot, en kijken of de ondergrond nog droog en stevig is.",
    },
    {
      title: "Advies: repareren, overlagen of vervangen",
      text: "Is de bestaande laag nog goed, dan kan er soms een nieuwe laag overheen. Is de ondergrond nat of verrot, dan moet het dak eraf.",
    },
    {
      title: "Ondergrond en isolatie",
      text: "We herstellen het dakbeschot waar nodig en brengen zo nodig afschotisolatie aan, zodat het water naar de afvoer loopt.",
    },
    {
      title: "Dakbedekking aanbrengen",
      text: "De nieuwe dakbedekking wordt aangebracht en zorgvuldig afgewerkt bij opstanden, doorvoeren en dakranden.",
    },
    {
      title: "Dakranden en afvoeren",
      text: "Nieuwe daktrim of afdekkap, schone en goed aangesloten afvoeren. Daarna lopen we het dak met u na.",
    },
  ],
  materials: {
    intro: "De twee meest gebruikte dakbedekkingen voor platte daken hebben elk hun eigen sterke punten.",
    items: [
      {
        title: "Bitumen",
        text: "Wordt in twee lagen aangebracht. Sterk, beloopbaar en goed te repareren. De bovenlaag heeft een beschermende leislag.",
      },
      {
        title: "EPDM",
        text: "Rubber dakbedekking die vaak in één stuk op maat wordt gelegd. Weinig naden, elastisch en een lange levensduur.",
      },
      {
        title: "Isolatie volgens het warm-dakprincipe",
        text: "De isolatie ligt boven op het dakbeschot, onder de dakbedekking. Zo blijft de constructie droog en warm.",
      },
      {
        title: "Daktrim en afdekkappen",
        text: "Aluminium of zinken afwerking langs de dakrand, die de bedekking opsluit en het water van de gevel af houdt.",
      },
    ],
    brands: ["Kingspan Unidek"],
  },
  priceFactors: [
    "De oppervlakte van het dak",
    "Overlagen of het oude dak volledig verwijderen",
    "Wel of niet (extra) isoleren",
    "De staat van de ondergrond",
    "Aantal doorvoeren, lichtkoepels en opstanden",
    "De lengte van de dakrand en het type afwerking",
  ],
  faq: [
    {
      serviceSlug: "platte-daken",
      question: "Hoe lang gaat een plat dak mee?",
      answer:
        "Dat hangt af van het materiaal, de uitvoering en het onderhoud. Reken bij bitumen op ruwweg twintig tot dertig jaar; EPDM kan langer mee. Jaarlijks de afvoeren schoonmaken en het dak nalopen verlengt de levensduur merkbaar.",
    },
    {
      serviceSlug: "platte-daken",
      question: "Kan er een nieuwe laag over mijn bestaande dak?",
      answer:
        "Vaak wel, als de bestaande dakbedekking goed hecht en de ondergrond droog is. Zit er vocht in de isolatie of het dakbeschot, dan sluit u dat met een nieuwe laag op. In dat geval adviseren wij om het dak te vervangen.",
    },
    {
      serviceSlug: "platte-daken",
      question: "Is water op een plat dak erg?",
      answer:
        "Een plat dak ligt nooit helemaal vlak; een beetje water na een bui is normaal. Blijft het dagenlang staan, dan belast dat de naden en de constructie. Dat is op te lossen met afschotisolatie of een extra afvoer.",
    },
  ],
  related: ["dakrenovatie", "lood-en-zinkwerk", "timmerwerk"],
};

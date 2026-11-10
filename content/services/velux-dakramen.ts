import type { ServiceDetail } from "./types";

export const veluxDakramen: ServiceDetail = {
  slug: "velux-dakramen",
  heading: "VELUX dakramen plaatsen en vervangen",
  metaTitle: "VELUX dakramen plaatsen",
  metaDescription:
    "VELUX dakraam laten plaatsen of vervangen. Waterdicht ingewerkt in uw pannendak, met het juiste gootstuk en een nette aansluiting. Vraag een vrijblijvende offerte aan.",
  intro: [
    "Een dakraam maakt van een donkere zolder een kamer waar u wilt zijn. Het brengt daglicht en frisse lucht, zonder de verbouwing van een dakkapel. Wij plaatsen nieuwe VELUX dakramen en vervangen oude exemplaren die lekken, beslaan of niet meer goed sluiten.",
    "Het raam zelf is fabriekswerk. Of het dicht blijft, hangt af van hoe het in het dak wordt ingewerkt: de sparing, de aansluiting op de folie en het gootstuk dat het water om het raam heen leidt. Dat is dakdekkerswerk.",
  ],
  image: "elst1",
  whenNeeded: {
    intro: "Een nieuw dakraam, of toch het oude vervangen? Dit zijn de meest voorkomende aanleidingen:",
    items: [
      {
        title: "Meer daglicht op zolder",
        text: "U wilt de zolder gebruiken als slaapkamer of werkplek. Eén of twee dakramen op de juiste plek maken daarbij een groot verschil.",
      },
      {
        title: "Een oud dakraam dat lekt of tocht",
        text: "Verweerde rubbers, een kromgetrokken kozijn of een gootstuk dat is losgeraakt. Bij een raam van enkele tientallen jaren oud is vervangen meestal de beste oplossing.",
      },
      {
        title: "Condens tussen het glas",
        text: "Dan is de ruit lek en isoleert het glas niet meer. Soms kan alleen de ruit worden vervangen, bij oudere ramen is een nieuw raam verstandiger.",
      },
      {
        title: "Tegelijk met een dakrenovatie",
        text: "Als de pannen er toch af gaan, is een dakraam plaatsen of vervangen weinig extra werk. De aansluiting op de nieuwe folie is dan ook het mooist.",
      },
    ],
  },
  process: [
    {
      title: "Plek en maat bepalen",
      text: "We bekijken samen waar het raam moet komen. De plaats van gordingen en sporen bepaalt welke breedtes zonder ingrijpen in de constructie mogelijk zijn.",
    },
    {
      title: "Sparing maken",
      text: "Van buitenaf nemen we de pannen weg en zagen we de opening. Moet er een spoor worden onderbroken, dan vangen we die op met een raveling.",
    },
    {
      title: "Raam plaatsen en inwerken",
      text: "Het kozijn wordt gesteld en vastgezet. De isolatiekraag en de folie-aansluiting sluiten het raam aan op het dak, het gootstuk voert het water af.",
    },
    {
      title: "Pannen aanhelen",
      text: "De pannen worden rondom op maat gemaakt en teruggelegd, zodat het raam strak in het dakvlak ligt.",
    },
    {
      title: "Binnenzijde",
      text: "De aftimmering aan de binnenkant kan worden meegenomen. We spreken vooraf af wie dat doet.", // TODO: aanleveren door klant (verzorgt Evers ook de binnenafwerking?)
    },
  ],
  materials: {
    intro: "Binnen het VELUX-assortiment zijn er een paar keuzes die u vooraf maakt.",
    items: [
      {
        title: "Tuimelvenster of uitzetvenster",
        text: "Een tuimelvenster draait om het midden en is makkelijk schoon te maken. Een uitzetvenster scharniert bovenaan en geeft vrij uitzicht als het open staat.",
      },
      {
        title: "Bediening",
        text: "Met de hand, elektrisch of op zonne-energie. Elektrische bediening is handig bij ramen waar u niet bij kunt.",
      },
      {
        title: "Beglazing",
        text: "Standaard isolerend glas of een variant die extra warmte of geluid tegenhoudt. Welke past, hangt af van de ruimte en de ligging van het dak.",
      },
      {
        title: "Gootstuk en isolatiekraag",
        text: "Afgestemd op uw type dakbedekking. Deze onderdelen zorgen voor een waterdichte en geïsoleerde aansluiting.",
      },
    ],
    brands: ["VELUX"],
  },
  priceFactors: [
    "De maat en het type dakraam",
    "Handbediend, elektrisch of op zonne-energie",
    "Nieuw plaatsen of een bestaand raam vervangen",
    "Of de dakconstructie moet worden aangepast",
    "Wel of geen binnenafwerking, zonwering of rolluik",
  ],
  faq: [
    {
      serviceSlug: "velux-dakramen",
      question: "Heb ik een vergunning nodig voor een dakraam?",
      answer:
        "Vaak niet, maar het hangt af van uw situatie. Voor een monument, een beschermd stads- of dorpsgezicht of een raam aan de straatzijde kunnen andere regels gelden. Via het Omgevingsloket van de overheid kunt u dit voor uw adres controleren.",
    },
    {
      serviceSlug: "velux-dakramen",
      question: "Past een nieuw VELUX dakraam in de opening van mijn oude raam?",
      answer:
        "Bij een oud VELUX-raam is er meestal een nieuw raam in dezelfde maat. Dan hoeft de opening niet te worden aangepast. Bij andere merken of afwijkende maten bekijken we wat de best passende oplossing is.",
    },
    {
      serviceSlug: "velux-dakramen",
      question: "Hoe lang duurt het plaatsen van een dakraam?",
      answer:
        "Een enkel dakraam in een bestaand pannendak is doorgaans binnen een dag geplaatst en waterdicht. De binnenafwerking kan daar nog bij komen.", // TODO: aanleveren door klant (doorlooptijd bevestigen)
    },
  ],
  related: ["dakrenovatie", "timmerwerk", "lood-en-zinkwerk"],
};

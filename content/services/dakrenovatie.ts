import type { ServiceDetail } from "./types";

export const dakrenovatie: ServiceDetail = {
  slug: "dakrenovatie",
  heading: "Dakrenovatie: uw pannendak vernieuwd",
  metaTitle: "Dakrenovatie",
  metaDescription:
    "Dakrenovatie van uw hellende dak: nieuwe dakpannen, panlatten en folie, met of zonder isolatie. Lees wanneer renoveren nodig is en hoe wij te werk gaan.",
  intro: [
    "Een pannendak gaat tientallen jaren mee, maar niet eindeloos. Pannen worden poreus, panlatten verliezen hun draagkracht en het onderdak eronder verteert. Bij een dakrenovatie vervangen wij de complete opbouw boven het dakbeschot, zodat uw dak weer waterdicht en winddicht is.",
    "Omdat het dak dan toch open ligt, is het ook het moment om te isoleren. Dat hoeft niet, maar het is nooit zo eenvoudig als tijdens een renovatie. Wij bekijken uw dak, vertellen eerlijk of renoveren nodig is of dat een reparatie volstaat, en zetten dat in een offerte.",
  ],
  image: "elst2",
  whenNeeded: {
    intro: "Niet elk probleem vraagt om een nieuw dak. Deze signalen wijzen er wel op dat renoveren verstandig wordt:",
    items: [
      {
        title: "Pannen die poreus zijn of afbrokkelen",
        text: "Oude pannen nemen water op, vriezen kapot en laten schilfers los. Ziet u veel gruis in de goot of afgebroken hoeken, dan is het einde van de levensduur in zicht.",
      },
      {
        title: "Lekkage op meerdere plekken",
        text: "Eén lekkage is meestal te repareren. Komt het water op steeds andere plekken binnen, dan ligt de oorzaak vaak in het onderdak of de panlatten.",
      },
      {
        title: "Een doorgezakt of golvend dakvlak",
        text: "Ligt het dak niet meer strak, dan zijn panlatten of tengels verrot of te zwaar belast. Dat herstelt u niet door alleen pannen te vervangen.",
      },
      {
        title: "Tocht en hoge stookkosten",
        text: "Een ongeïsoleerd dak verliest veel warmte. Met isolatie aan de buitenzijde blijft de ruimte onder het dak volledig bruikbaar.",
      },
      {
        title: "Plannen voor zonnepanelen of een dakkapel",
        text: "Zonnepanelen liggen er twintig jaar of langer. Het is zonde als ze er na een paar jaar af moeten omdat het dak eronder op is.",
      },
    ],
  },
  process: [
    {
      title: "Inspectie en offerte",
      text: "We bekijken pannen, nok, goten, aansluitingen en waar mogelijk het dakbeschot van binnenuit. U krijgt een offerte waarin staat wat we vervangen en wat kan blijven.",
    },
    {
      title: "Steiger en bescherming",
      text: "We plaatsen een steiger met randbeveiliging en dekken kwetsbare plekken rond de woning af.",
    },
    {
      title: "Strippen en controleren",
      text: "Pannen, panlatten en het oude onderdak gaan eraf. Nu zien we het dakbeschot pas echt: aangetaste delen vervangen we direct.",
    },
    {
      title: "Nieuwe opbouw",
      text: "Eventueel isolatie, daarna een dampopen folie, tengels en panlatten op de juiste latafstand. Daarop leggen en verankeren we de nieuwe pannen.",
    },
    {
      title: "Afwerking en oplevering",
      text: "Nok en hoekkepers, aansluitingen bij schoorsteen en dakramen, goten. We ruimen op, voeren het afval af en lopen het werk samen met u na.",
    },
  ],
  materials: {
    intro:
      "De keuze voor het materiaal bepaalt hoe uw dak eruitziet en hoe lang het meegaat. Wij leggen de verschillen uit, u kiest.",
    items: [
      {
        title: "Keramische dakpannen",
        text: "Gebakken klei. Kleurvast, weinig aangroei en een zeer lange levensduur. Duurder in aanschaf dan beton.",
      },
      {
        title: "Betonpannen",
        text: "Voordeliger en verkrijgbaar in veel modellen. De toplaag verweert op termijn, waardoor de kleur wat vervaagt.",
      },
      {
        title: "Dampopen folie en panlatten",
        text: "De folie houdt stuifsneeuw en regen tegen en laat vocht van binnenuit ontsnappen. Tengels zorgen dat water onder de panlatten door kan weglopen.",
      },
      {
        title: "Isolatie aan de buitenzijde",
        text: "Isolatieplaten of complete dakelementen op het dakbeschot. De binnenafwerking blijft onaangetast.",
      },
    ],
    brands: ["Koramic", "Monier", "Kingspan Unidek"],
  },
  priceFactors: [
    "De oppervlakte en de helling van het dak",
    "Keramische of betonnen pannen",
    "Wel of niet isoleren, en hoe dik",
    "De staat van het dakbeschot",
    "Aantal aansluitingen: schoorstenen, dakramen, dakkapellen en kilgoten",
    "Bereikbaarheid voor steiger en materiaal",
  ],
  faq: [
    {
      serviceSlug: "dakrenovatie",
      question: "Kan ik tijdens de dakrenovatie in huis blijven wonen?",
      answer:
        "Ja. We werken per dakvlak en maken het dak aan het einde van elke werkdag waterdicht. U heeft wel te maken met geluid en met een steiger rond de woning.",
    },
    {
      serviceSlug: "dakrenovatie",
      question: "Kunnen de oude dakpannen worden hergebruikt?",
      answer:
        "Soms. Zijn de pannen nog goed en ligt het probleem in het onderdak of de latten, dan kunnen we ze omleggen. Poreuze of beschadigde pannen leggen we niet terug.",
    },
    {
      serviceSlug: "dakrenovatie",
      question: "Is isoleren verplicht bij een dakrenovatie?",
      answer:
        "Bij een ingrijpende renovatie kunnen er wettelijke isolatie-eisen gelden. Wij bespreken bij de inspectie wat voor uw dak van toepassing is en nemen de isolatie als aparte post op in de offerte.",
    },
  ],
  related: ["lood-en-zinkwerk", "velux-dakramen", "schoorsteenrenovatie"],
};

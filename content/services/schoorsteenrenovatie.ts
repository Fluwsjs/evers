import type { ServiceDetail } from "./types";

export const schoorsteenrenovatie: ServiceDetail = {
  slug: "schoorsteenrenovatie",
  heading: "Schoorsteenrenovatie: voegwerk, lood en afdekking hersteld",
  metaTitle: "Schoorsteenrenovatie",
  metaDescription:
    "Schoorsteen laten renoveren: nieuw voegwerk, nieuwe loodaansluitingen en een dichte afdekplaat. Voorkom lekkage en losse stenen. Vraag een vrijblijvende offerte aan.",
  intro: [
    "De schoorsteen is het meest blootgestelde deel van uw dak. Hij staat vol in de wind en de regen, en dat jaar in, jaar uit. Voegen spoelen uit, lood scheurt en de afdekplaat barst. Het gevolg merkt u vaak pas binnen: een vochtplek op de zoldermuur of het plafond bij de schoorsteen.",
    "Bij een schoorsteenrenovatie pakken wij alles aan wat water doorlaat. Meestal is dat voegwerk, lood en afdekking tegelijk, omdat die onderdelen even oud zijn. Zo hoeft de steiger maar één keer te staan.",
  ],
  image: null, // TODO: aanleveren door klant (foto van een gerenoveerde schoorsteen)
  whenNeeded: {
    intro: "Vanaf de straat is niet alles te zien, maar deze signalen zijn duidelijk:",
    items: [
      {
        title: "Uitgesleten of ontbrekende voegen",
        text: "Ziet u diepe, donkere naden tussen de stenen, of ligt er voegzand in de goot, dan dringt er water in het metselwerk.",
      },
      {
        title: "Vochtplekken bij de schoorsteen",
        text: "Bruine kringen op het plafond of een natte zoldermuur rond het rookkanaal wijzen bijna altijd op lood of voegwerk dat niet meer sluit.",
      },
      {
        title: "Gescheurd of losgewaaid lood",
        text: "Het lood rond de voet van de schoorsteen moet strak in de voeg zitten en over de pannen heen vallen. Staat het omhoog of zitten er scheuren in, dan loopt het water erachter.",
      },
      {
        title: "Een gebarsten afdekplaat",
        text: "Door de betonnen plaat boven op de schoorsteen kan water recht het metselwerk in zakken. Bij vorst drukt dat de stenen uit elkaar.",
      },
      {
        title: "Losse stenen of een scheve schoorsteen",
        text: "Dit is een veiligheidsrisico. Laat het snel bekijken, zeker voor het stormseizoen.",
      },
    ],
  },
  process: [
    {
      title: "Inspectie",
      text: "We bekijken het metselwerk, de voegen, het lood, de afdekplaat en de aansluiting op het dak. Daarna weet u of herstel volstaat of dat opnieuw opmetselen nodig is.",
    },
    {
      title: "Veilig bereikbaar maken",
      text: "Afhankelijk van de plek op het dak werken we vanaf een steiger of een dakladder met valbeveiliging.",
    },
    {
      title: "Voegen uithakken en opnieuw voegen",
      text: "De oude voegen worden tot voldoende diepte verwijderd. Losse stenen zetten we opnieuw, daarna voegen we het geheel in een passende kleur.",
    },
    {
      title: "Lood en afdekking vernieuwen",
      text: "Nieuw lood rondom, in de voeg ingeslepen en netjes over de pannen geklopt. Zo nodig een nieuwe afdekplaat of kap.",
    },
    {
      title: "Afwerken en controleren",
      text: "Het metselwerk kan worden geïmpregneerd, zodat het minder water opneemt. We leggen de pannen terug en controleren de aansluiting.",
    },
  ],
  materials: {
    intro: "Een schoorsteen is klein, maar er komen veel materialen samen. Elk onderdeel moet kloppen.",
    items: [
      {
        title: "Voegmortel",
        text: "Afgestemd op de hardheid van de steen. Een te harde voeg op een zachte steen laat de steen zelf kapotvriezen.",
      },
      {
        title: "Bladlood",
        text: "Wordt in stroken van beperkte lengte aangebracht, zodat het kan uitzetten en krimpen zonder te scheuren.",
      },
      {
        title: "Afdekplaat of schoorsteenkap",
        text: "Een plaat met voldoende overstek en een waterhol aan de onderkant, zodat het water van het metselwerk af druipt.",
      },
      {
        title: "Impregneermiddel",
        text: "Maakt het metselwerk waterafstotend en laat het toch ademen. Het is een aanvulling op goed voegwerk, geen vervanging.",
      },
    ],
    brands: [],
  },
  priceFactors: [
    "De afmetingen van de schoorsteen en het aantal kanalen",
    "Alleen voegwerk, of ook lood en afdekplaat",
    "De staat van het metselwerk: herstellen of opnieuw opmetselen",
    "De plek op het dak en de hoogte",
    "Of er een steiger nodig is",
  ],
  faq: [
    {
      serviceSlug: "schoorsteenrenovatie",
      question: "Mijn schoorsteen wordt niet meer gebruikt. Moet ik hem toch laten renoveren?",
      answer:
        "Een ongebruikte schoorsteen lekt net zo goed als een gebruikte. U kunt hem laten renoveren, of laten verwijderen tot onder het dakvlak, waarna het dak wordt dichtgezet. Wij bespreken beide mogelijkheden met u.",
    },
    {
      serviceSlug: "schoorsteenrenovatie",
      question: "Kan alleen het lood worden vervangen?",
      answer:
        "Dat kan, als het voegwerk en de afdekplaat nog goed zijn. Omdat het lood in de voeg wordt vastgezet, kijken we altijd naar het geheel. Slecht voegwerk boven nieuw lood geeft binnen korte tijd opnieuw lekkage.",
    },
    {
      serviceSlug: "schoorsteenrenovatie",
      question: "Hoe weet ik of de lekkage van de schoorsteen komt?",
      answer:
        "Een vochtplek vlak bij het rookkanaal is een sterke aanwijzing, maar zeker weet u het pas na inspectie op het dak. Soms ligt de oorzaak in een kapotte pan of een nokvorst vlak boven de schoorsteen.",
    },
  ],
  related: ["lood-en-zinkwerk", "dakrenovatie", "timmerwerk"],
};

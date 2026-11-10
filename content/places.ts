/**
 * Plaatsen met een eigen pagina (/dakdekker-[slug]/).
 * Welke plaatsen actief zijn bepaalt `site.serviceArea.places`.
 *
 * Elke pagina moet echt eigen inhoud hebben: een project in die plaats en informatie
 * die voor daken dáár relevant is. Geen pagina's waarin alleen de plaatsnaam verschilt.
 * Voeg een plaats dus pas toe als er iets over te vertellen is.
 *
 * De teksten bevatten algemeen bekende informatie over de plaats en algemene vakkennis.
 * TODO: aanleveren door klant (teksten laten nalezen en aanvullen met eigen ervaring per plaats)
 */
export interface Place {
  slug: string;
  name: string;
  /** Voor de schematische kaart op /werkgebied/. */
  lat: number;
  lon: number;
  metaDescription: string;
  /** Inleiding onder de H1. */
  intro: string;
  local: {
    title: string;
    paragraphs: string[];
  };
  /** Praktische aandachtspunten voor daken in deze plaats. */
  tips: Array<{ title: string; text: string }>;
}

export const places: Place[] = [
  {
    slug: "elst",
    name: "Elst",
    lat: 51.919,
    lon: 5.849,
    metaDescription:
      "Dakdekker in Elst (Overbetuwe) voor dakrenovatie, lood- en zinkwerk, platte daken en dakramen. Bekijk onze dakrenovatie in Elst en vraag een vrijblijvende offerte aan.",
    intro:
      "Zoekt u een dakdekker in Elst? Wij renoveerden hier een pannendak rond bestaande dakkapellen, met nieuwe goten. Hieronder ziet u dat project en leest u waar u bij een dak in Elst op kunt letten.",
    local: {
      title: "Daken in Elst en de Betuwe",
      paragraphs: [
        "Elst ligt in de gemeente Overbetuwe, midden tussen Arnhem en Nijmegen. Rond de oude dorpskern liggen wijken uit heel verschillende bouwperiodes. Dat ziet u terug op het dak: van oudere woningen met dakkapellen en gemetselde schoorstenen tot rijwoningen met een eenvoudig zadeldak.",
        "Bij woningen van enkele tientallen jaren oud zit het probleem vaak niet in de dakpan zelf, maar in wat eronder ligt. Het onderdak is verteerd of de panlatten hebben hun draagkracht verloren. Van buitenaf ziet het dak er dan nog redelijk uit, terwijl het bij storm en slagregen water doorlaat.",
      ],
    },
    tips: [
      {
        title: "Wind in open landschap",
        text: "In het vlakke rivierengebied staat een dak vol in de wind. Nokvorsten, gevelpannen en de onderste rijen pannen moeten goed verankerd zijn.",
      },
      {
        title: "Dakkapellen",
        text: "De aansluiting van een dakkapel op het dakvlak is een bekende lekplek. Bij een dakrenovatie is het verstandig die aansluitingen meteen te vernieuwen.",
      },
      {
        title: "Goten en bomen",
        text: "Staan er bomen bij uw woning, laat de goten dan na de herfst schoonmaken. Een verstopte goot loopt over langs de gevel en de boeidelen.",
      },
    ],
  },
  {
    slug: "zutphen",
    name: "Zutphen",
    lat: 52.138,
    lon: 6.201,
    metaDescription:
      "Dakdekker in Zutphen voor nieuwbouw, dakrenovatie, lood- en zinkwerk en dakramen. Bekijk ons nieuwbouwproject in Zutphen en vraag een vrijblijvende offerte aan.",
    intro:
      "Zoekt u een dakdekker in Zutphen? Wij dekten hier de daken van nieuwbouwwoningen, met kilgoten en dakramen. Hieronder ziet u dat project en leest u wat er in Zutphen bij dakwerk komt kijken.",
    local: {
      title: "Daken in Zutphen: van binnenstad tot nieuwbouw",
      paragraphs: [
        "Zutphen is een Hanzestad aan de IJssel met een historische binnenstad vol monumenten. Daaromheen liggen vooroorlogse wijken, naoorlogse uitbreidingen en recente nieuwbouw. Voor een dakdekker zijn dat heel verschillende daken: van oude gebakken pannen op een eeuwenoude kap tot strakke vlakke pannen op een nieuwe woning.",
        "Ons project in Zutphen was nieuwbouw. Daar draait het om maatvoering en detail: kilgoten waar twee dakvlakken samenkomen, de aansluiting rond dakramen en strakke gevelafwerking. Dezelfde zorg voor aansluitingen geldt bij renovatie van een bestaand dak.",
      ],
    },
    tips: [
      {
        title: "Monument of beschermd stadsgezicht",
        text: "Voor panden in de historische binnenstad kan een vergunning nodig zijn, ook als u alleen de pannen vervangt door een ander type of een dakraam wilt plaatsen. Controleer dit vooraf bij de gemeente of via het Omgevingsloket.",
      },
      {
        title: "Oude kappen",
        text: "Een oude kapconstructie is zelden recht. Het dakbeschot en de latten moeten worden uitgevuld voordat er nieuwe pannen op kunnen.",
      },
      {
        title: "Schoorstenen",
        text: "Oudere woningen hebben vaak meerdere gemetselde schoorstenen. Voegwerk en lood daarvan verdienen bij elke dakinspectie aandacht.",
      },
    ],
  },
  {
    slug: "arnhem",
    name: "Arnhem",
    lat: 51.985,
    lon: 5.899,
    metaDescription:
      "Dakdekker in Arnhem voor nieuwbouw, dakrenovatie, platte daken en lood- en zinkwerk. Bekijk ons werk in de wijk Schuytgraaf en vraag een vrijblijvende offerte aan.",
    intro:
      "Zoekt u een dakdekker in Arnhem? In de wijk Schuytgraaf dekten wij de daken van meerdere woonblokken. Hieronder ziet u dat project en leest u waar u bij een dak in Arnhem op kunt letten.",
    local: {
      title: "Daken in Arnhem: nieuwbouw in Zuid, oudere wijken in Noord",
      paragraphs: [
        "Schuytgraaf is een grote nieuwbouwwijk in Arnhem-Zuid. Wij dekten daar de pannendaken van meerdere woonblokken. In nieuwbouw volgt de ene woning op de andere: planning en een vaste, nette werkwijze zijn dan net zo belangrijk als het dekken zelf.",
        "Arnhem-Noord ziet er heel anders uit. Daar staan veel vooroorlogse woningen met steile pannendaken, dakkapellen, erkers en schoorstenen. Zulke daken hebben veel aansluitingen, en juist daar ontstaan na verloop van jaren de lekkages.",
      ],
    },
    tips: [
      {
        title: "Zonnepanelen op een bestaand dak",
        text: "Laat het dak controleren voordat er zonnepanelen op komen. Panelen liggen er twintig jaar of langer; in die tijd wilt u ze niet hoeven weghalen voor een dakrenovatie.",
      },
      {
        title: "Bomen en bladval",
        text: "In de groene wijken tegen de Veluwezoom vallen veel bladeren en naalden op het dak. Goten en kilgoten slibben daar sneller dicht.",
      },
      {
        title: "Platte daken op aanbouwen",
        text: "Veel oudere woningen hebben een aanbouw of dakkapel met een plat dak. Die dakbedekking is vaak ouder dan gedacht en verdient een inspectie.",
      },
    ],
  },
];

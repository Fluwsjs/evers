export interface FaqItem {
  question: string;
  answer: string;
  /** Leeg = algemene vraag. Gevuld = hoort bij die dienst. */
  serviceSlug?: string;
  /** Alleen tonen als dit onderdeel op de site zichtbaar is. */
  requires?: "calculator";
}

/**
 * Algemene vragen. De antwoorden bevatten alleen wat op de huidige site staat
 * of wat de nieuwe site aantoonbaar doet (zoals foto's meesturen).
 *
 * TODO: aanleveren door klant (antwoorden laten nalezen; aanvullen met reactietijd,
 * garantietermijnen en werkgebied zodra die bekend zijn)
 */
export const generalFaq: FaqItem[] = [
  {
    question: "Welke werkzaamheden voert u uit?",
    answer:
      "Wij renoveren hellende daken, leggen en herstellen platte daken, renoveren schoorstenen, maken lood- en zinkwerk, doen timmerwerk aan het dak en plaatsen VELUX dakramen. Wij werken zowel aan bestaande woningen als in de nieuwbouw.",
  },
  {
    question: "Is een offerte vrijblijvend?",
    answer:
      "Ja. We maken eerst een afspraak om uw dak te bekijken en uw wensen te bespreken. Daarna ontvangt u een offerte. U zit nergens aan vast tot u akkoord geeft.",
  },
  {
    question: "Kan ik foto's van mijn dak meesturen?",
    answer:
      "Ja, dat helpt ons om uw aanvraag goed in te schatten. In het offerteformulier kunt u maximaal vijf foto's toevoegen.",
  },
  {
    question: "Krijg ik garantie op het werk?",
    answer:
      "Ja, u krijgt garantie op onze werkzaamheden. Welke garantie voor uw klus geldt, leggen we vast in de offerte.",
  },
  {
    question: "Wat betekent het dat u VCA-gecertificeerd bent?",
    answer:
      "VCA staat voor Veiligheid, Gezondheid en Milieu Checklist Aannemers. Het certificaat laat zien dat wij aantoonbaar veilig werken: op hoogte, met de juiste beschermingsmiddelen en met oog voor de omgeving.",
  },
  {
    requires: "calculator",
    question: "Is de prijs uit de calculator de definitieve prijs?",
    answer:
      "Nee, de calculator geeft een indicatie op basis van vanaf-prijzen. De definitieve prijs hangt af van de staat van uw dak, de bereikbaarheid en de materiaalkeuze, en volgt na een inspectie in de offerte.",
  },
];

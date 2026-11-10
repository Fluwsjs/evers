export interface ProcessStep {
  title: string;
  text: string;
}

/** Werkwijze in vier stappen, herschreven op basis van de huidige site. */
export const processSteps: ProcessStep[] = [
  {
    title: "Advies en inspectie",
    text: "We maken een vrijblijvende afspraak, bekijken uw dak en bespreken wat u wilt.",
  },
  {
    title: "Offerte",
    text: "U ontvangt een duidelijke offerte: wat we doen, met welke materialen en wat het kost.",
  },
  {
    title: "Uitvoering",
    text: "Na uw akkoord plannen we het werk in, regelen we materiaal en veiligheidsvoorzieningen en gaan we aan de slag.",
  },
  {
    title: "Oplevering en garantie",
    text: "Na een laatste controle leveren we het werk netjes op. U krijgt garantie op onze werkzaamheden.",
  },
];

import type { Metadata } from "next";
import { site } from "@config/site";
import { generalFaq } from "@content/faq";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { BrandBar } from "@/components/sections/BrandBar";
import { CallbackSection } from "@/components/sections/CallbackSection";
import { FaqSection } from "@/components/sections/FaqAccordion";
import { Hero } from "@/components/sections/Hero";
import { KeyFigures } from "@/components/sections/KeyFigures";
import { PriceCalculatorSection } from "@/components/sections/PriceCalculatorSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ProjectHighlights } from "@/components/sections/ProjectHighlights";
import { Reviews } from "@/components/sections/Reviews";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { isCalculatorVisible } from "@/lib/pricing/price-list";

// Canonical, Open Graph en structured data volgen in fase 9.
export const metadata: Metadata = {
  title: { absolute: `Dakdekker voor dakrenovatie en nieuwbouw | ${site.shortName}` },
  description:
    `${site.name}: dakrenovatie, platte daken, schoorsteenrenovatie, lood- en zinkwerk, timmerwerk en VELUX dakramen. VCA-gecertificeerd. Vraag een vrijblijvende offerte aan.`,
};

/**
 * Homepage. De volgorde volgt de vragen van een bezoeker: wat doet u, kunt u dat laten
 * zien, hoe gaat het, wat kost het, wie bent u, werkt u bij mij. De offerte staat bovenaan
 * (kaart in de hero) en onderaan (terugbellen); het volledige formulier en de prijstabel
 * hebben hun eigen pagina. Topbalk, header en footer staan in de layout.
 */
export default function HomePage() {
  // Vragen over een onderdeel dat niet te zien is (de calculator zonder prijzen) blijven weg.
  const faq = generalFaq.filter((item) => item.requires !== "calculator" || isCalculatorVisible()).slice(0, 6);

  return (
    <>
      <Hero />
      <BrandBar />
      <KeyFigures />
      <ServiceCards />
      <ProjectHighlights />
      <ProcessSteps />
      <PriceCalculatorSection tone="sand" />
      <AboutTeaser />
      <Reviews />
      <ServiceArea />
      <FaqSection items={faq} />
      <CallbackSection />
    </>
  );
}

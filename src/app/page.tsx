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

// Canonical, Open Graph en structured data volgen in fase 9.
export const metadata: Metadata = {
  title: { absolute: `Dakdekker voor dakrenovatie en nieuwbouw | ${site.shortName}` },
  description:
    `${site.name}: dakrenovatie, platte daken, schoorsteenrenovatie, lood- en zinkwerk, timmerwerk en VELUX dakramen. VCA-gecertificeerd. Vraag een vrijblijvende offerte aan.`,
};

/** Homepage. De volgorde van de secties volgt de masterprompt (topbalk, header en footer staan in de layout). */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandBar />
      <KeyFigures />
      <AboutTeaser />
      <ServiceCards />
      <PriceCalculatorSection />
      <ProcessSteps />
      <ProjectHighlights />
      <Reviews />
      <ServiceArea />
      <FaqSection items={generalFaq.slice(0, 6)} />
      <CallbackSection />
    </>
  );
}

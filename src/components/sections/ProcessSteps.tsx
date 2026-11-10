import { processSteps } from "@content/process";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";

export function ProcessSteps() {
  return (
    <Section tone="ink" labelledBy="werkwijze-titel">
      <SectionHeading
        id="werkwijze-titel"
        eyebrow="Werkwijze"
        title={`In ${processSteps.length} stappen van eerste afspraak tot oplevering`}
        intro="U weet vooraf wat we gaan doen, wat het kost en wanneer."
      />
      <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 80} className="border-t-2 border-brand pt-5">
              <span aria-hidden="true" className="font-display text-5xl font-extrabold text-brand">
                {index + 1}
              </span>
              <h3 className="mt-3 text-xl text-white">
                <span className="sr-only">Stap {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-on-dark-muted">{step.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

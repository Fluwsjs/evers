import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "white" | "sand" | "ink";

const tones: Record<Tone, string> = {
  white: "bg-white text-ink",
  sand: "bg-sand text-ink",
  ink: "on-dark bg-ink text-on-dark",
};

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  /** Id van de kop in deze sectie, voor `aria-labelledby`. */
  labelledBy?: string;
  className?: string;
}

export function Section({ children, tone = "white", id, labelledBy, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-16 md:py-24", tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}

/** Kop met optioneel label erboven en inleiding eronder. */
export function SectionHeading({ id, eyebrow, title, intro, as: Tag = "h2", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted in-[.on-dark]:text-on-dark-muted">
          <span aria-hidden="true" className="h-0.5 w-8 bg-brand" />
          {eyebrow}
        </p>
      ) : null}
      <Tag id={id} className={Tag === "h1" ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl"}>
        {title}
      </Tag>
      {intro ? <div className="mt-4 text-lg text-muted in-[.on-dark]:text-on-dark-muted">{intro}</div> : null}
    </div>
  );
}

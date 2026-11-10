import type { ReactNode } from "react";

/** Opmaak voor lange lopende tekst, zoals de privacyverklaring. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-4 text-lg [&_a]:font-semibold [&_a]:text-brand-strong [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h3]:mt-8 [&_h3]:text-xl [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
      {children}
    </div>
  );
}

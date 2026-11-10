import { cn } from "@/lib/utils";

/**
 * Het Evers-logo, nagetekend als SVG naar het bestaande PNG-logo (160×160 px,
 * te klein voor scherpe weergave). De woorden zijn echte tekst in het koppenlettertype.
 *
 * TODO: aanleveren door klant (logo als vectorbestand; dan vervangt dat deze natekening)
 */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-grid grid-cols-[auto_auto_auto] items-center gap-x-2 font-display leading-none font-extrabold uppercase",
        onDark ? "text-white" : "text-black",
        className,
      )}
    >
      <span className="text-[1.05rem] tracking-wide">Evers</span>
      <svg viewBox="0 0 48 42" aria-hidden="true" focusable="false" className="h-9 w-auto" fill="none">
        <path d="M4 17.5 24 3l20 14.5" stroke="var(--color-brand)" strokeWidth="4" strokeLinecap="round" />
        <path d="M10.5 21.5 24 11.5l13.5 10V39.5h-27Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="miter" />
      </svg>
      <span className="text-[1.05rem] tracking-wide">Totaal</span>
      <span className="col-span-3 mt-0.5 text-center text-[0.56rem] font-semibold tracking-[0.2em]">Montage</span>
    </span>
  );
}

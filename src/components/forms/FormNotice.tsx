"use client";

import { useSearchParams } from "next/navigation";

/**
 * Melding voor bezoekers zonder JavaScript: als een formulier niet verzonden kon worden,
 * stuurt de server terug naar deze pagina met `?fout=…` in de URL.
 */
export function FormNotice({ phone }: { phone: { href: string; display: string } }) {
  const error = useSearchParams().get("fout");
  if (error !== "terugbel" && error !== "contact") return null;

  return (
    <div role="alert" className="mb-8 rounded-lg border border-red-700 bg-red-50 p-4 text-red-900">
      <p className="font-semibold">
        {error === "terugbel" ? "Uw terugbelverzoek is niet verzonden." : "Uw bericht is niet verzonden."}
      </p>
      <p className="mt-1">
        Controleer of alle velden goed zijn ingevuld en probeer het opnieuw, of bel{" "}
        <a href={phone.href} className="font-semibold underline">
          {phone.display}
        </a>
        .
      </p>
    </div>
  );
}

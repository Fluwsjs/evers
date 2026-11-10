"use client";

import { useSearchParams } from "next/navigation";

/** Toont het referentienummer uit de URL, als dat het verwachte formaat heeft. */
export function Reference() {
  const reference = useSearchParams().get("ref");
  if (!reference || !/^EV-\d{8}-[A-Z0-9]{4}$/.test(reference)) return null;

  return (
    <p className="mt-6 inline-block rounded-lg border border-line bg-white px-4 py-3">
      Uw referentienummer: <strong className="font-display text-lg">{reference}</strong>
    </p>
  );
}

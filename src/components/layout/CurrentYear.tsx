"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Het huidige jaar. Op de server (en dus in de statische HTML) het bouwjaar,
 * in de browser het echte jaar. Zo loopt het copyright-jaar nooit achter.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  return <>{year}</>;
}

"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface ProjectFilterProps {
  options: FilterOption[];
  /** Per project: de slug, de diensten waarop gefilterd kan worden en de kaart zelf. */
  items: Array<{ slug: string; serviceSlugs: string[]; card: ReactNode }>;
}

const ALL = "alle";

/**
 * Projectenraster met filter per dienst.
 * Zonder JavaScript staan gewoon alle projecten in beeld.
 */
export function ProjectFilter({ options, items }: ProjectFilterProps) {
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? items : items.filter((item) => item.serviceSlugs.includes(active));

  return (
    <>
      {options.length > 1 ? (
        <div role="group" aria-label="Filter projecten op dienst" className="flex flex-wrap gap-2">
          {[{ value: ALL, label: "Alle projecten" }, ...options].map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={active === option.value}
              onClick={() => setActive(option.value)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 font-semibold transition-colors",
                active === option.value ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <p aria-live="polite" className="mt-6 text-sm text-muted">
        {visible.length} {visible.length === 1 ? "project" : "projecten"}
      </p>

      <ul className="mt-4 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.slug}>{item.card}</li>
        ))}
      </ul>
    </>
  );
}

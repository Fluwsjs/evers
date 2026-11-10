import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "outline-on-dark" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold leading-tight whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Donkere tekst op oranje: ±6,0:1
  primary: "bg-brand text-ink hover:bg-brand-hover",
  dark: "bg-ink text-white hover:bg-ink-700",
  outline: "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  "outline-on-dark": "border-2 border-on-dark bg-transparent text-on-dark hover:bg-on-dark hover:text-ink",
  ghost: "bg-transparent text-ink hover:bg-sand-200",
};

// Minimaal 44 px hoog: ruim boven de 24 px van WCAG 2.2 (2.5.8) en prettig op mobiel.
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-base",
  lg: "min-h-13 px-6 py-3.5 text-lg",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function buttonClasses({ variant = "primary", size = "md", className }: StyleProps = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = StyleProps & Omit<ComponentProps<"button">, "className">;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

interface ButtonLinkProps extends StyleProps {
  href: string;
  children: ReactNode;
  "aria-label"?: string;
}

/** Link met het uiterlijk van een knop. Kiest zelf tussen `next/link` en een gewone `<a>`. */
export function ButtonLink({ href, children, variant, size, className, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });

  if (/^(tel:|mailto:|https?:|#)/.test(href)) {
    const newTab = /^https?:/.test(href);
    return (
      <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

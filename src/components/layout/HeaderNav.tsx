"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavServiceGroup {
  title: string;
  description: string;
  links: NavLink[];
}

interface HeaderNavProps {
  siteName: string;
  groups: NavServiceGroup[];
  links: NavLink[];
  servicesHref: string;
  quoteHref: string;
  phone: { href: string; display: string };
}

type OpenPanel = "mega" | "mobile" | null;

const navItemClasses =
  "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 font-semibold whitespace-nowrap text-ink underline-offset-8 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-brand aria-[current=page]:decoration-2";

export function HeaderNav({ siteName, groups, links, servicesHref, quoteHref, phone }: HeaderNavProps) {
  const [open, setOpen] = useState<OpenPanel>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const megaId = useId();
  const mobileId = useId();

  const close = () => setOpen(null);
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Sluiten met Escape (focus terug naar de knop) en bij klikken buiten de header.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      (open === "mega" ? megaButtonRef : mobileButtonRef).current?.focus();
      setOpen(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-line bg-white">
      <Container className="flex min-h-18 items-center justify-between gap-4">
        <Link href="/" onClick={close} aria-label={`${siteName}, naar de homepage`} className="shrink-0 rounded-md py-2">
          <Logo />
        </Link>

        {/* Desktop */}
        <nav aria-label="Hoofdmenu" className="hidden xl:block">
          <ul className="flex items-center">
            <li>
              <button
                ref={megaButtonRef}
                type="button"
                aria-expanded={open === "mega"}
                aria-controls={megaId}
                onClick={() => setOpen(open === "mega" ? null : "mega")}
                className={cn(navItemClasses, isCurrent(servicesHref) && "underline decoration-brand decoration-2")}
              >
                Diensten
                <Icon
                  name="chevron-down"
                  className={cn("size-4 transition-transform duration-150", open === "mega" && "rotate-180")}
                />
              </button>
            </li>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  className={navItemClasses}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={phone.href}
            className="hidden min-h-11 items-center gap-2 rounded-lg px-3 font-semibold whitespace-nowrap text-ink hover:bg-sand-200 xl:inline-flex"
          >
            <Icon name="phone" className="text-brand-strong" />
            {phone.display}
          </a>
          {/* Op de kleinste schermen staat deze knop al in de vaste actiebalk onderaan. */}
          <div className="max-sm:hidden">
            <ButtonLink href={quoteHref}>Offerte aanvragen</ButtonLink>
          </div>
          <button
            ref={mobileButtonRef}
            type="button"
            aria-expanded={open === "mobile"}
            aria-controls={mobileId}
            onClick={() => setOpen(open === "mobile" ? null : "mobile")}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-ink px-3 font-semibold text-ink xl:hidden"
          >
            <Icon name={open === "mobile" ? "close" : "menu"} />
            Menu
          </button>
        </div>
      </Container>

      {/* Mega-menu (desktop) */}
      <div
        id={megaId}
        hidden={open !== "mega"}
        className="absolute inset-x-0 top-full border-b border-line bg-white shadow-card max-xl:hidden"
      >
        <Container className="grid gap-8 py-8 xl:grid-cols-[1fr_18rem]">
          <nav aria-label="Diensten" className="grid gap-8" style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))` }}>
            {groups.map((group) => (
              <div key={group.title}>
                <p className="font-display text-lg font-extrabold">{group.title}</p>
                <p className="mt-1 text-sm text-muted">{group.description}</p>
                <ul className="mt-4 space-y-1 border-t border-line pt-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={close}
                        aria-current={pathname === link.href ? "page" : undefined}
                        className="group -mx-3 block rounded-lg px-3 py-2.5 hover:bg-sand"
                      >
                        <span className="flex items-center gap-2 font-semibold">
                          {link.label}
                          <Icon
                            name="arrow-right"
                            className="size-4 text-brand-strong opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                          />
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">{link.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="on-dark flex flex-col justify-between gap-6 rounded-card bg-ink p-6 text-on-dark">
            <div>
              <p className="font-display text-xl font-extrabold text-white">Weet u nog niet wat nodig is?</p>
              <p className="mt-2 text-sm text-on-dark-muted">
                Beschrijf uw situatie en stuur een paar foto&apos;s mee. Wij denken met u mee.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonLink href={quoteHref}>Offerte aanvragen</ButtonLink>
              <Link
                href={servicesHref}
                onClick={close}
                className="inline-flex min-h-11 items-center justify-center gap-2 font-semibold text-white underline-offset-4 hover:underline"
              >
                Alle diensten bekijken
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobiel menu */}
      <div
        id={mobileId}
        hidden={open !== "mobile"}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-13rem)] overflow-y-auto md:max-h-[calc(100dvh-9rem)] border-b border-line bg-white shadow-card xl:hidden"
      >
        <Container className="py-4">
          <nav aria-label="Hoofdmenu mobiel">
            <ul className="divide-y divide-line">
              <li>
                <details className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
                    Diensten
                    <Icon name="chevron-down" className="transition-transform duration-150 group-open:rotate-180" />
                  </summary>
                  <div className="space-y-4 pb-4">
                    {groups.map((group) => (
                      <div key={group.title}>
                        <p className="text-sm font-semibold tracking-wide text-muted uppercase">{group.title}</p>
                        <ul>
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={close}
                                aria-current={pathname === link.href ? "page" : undefined}
                                className="flex min-h-11 items-center"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link
                      href={servicesHref}
                      onClick={close}
                      className="flex min-h-11 items-center gap-2 font-semibold text-brand-strong"
                    >
                      Alle diensten
                      <Icon name="arrow-right" className="size-4" />
                    </Link>
                  </div>
                </details>
              </li>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    className="flex min-h-12 items-center font-semibold aria-[current=page]:text-brand-strong"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ButtonLink href={quoteHref}>Offerte aanvragen</ButtonLink>
            <ButtonLink href={phone.href} variant="outline">
              <Icon name="phone" />
              {phone.display}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}

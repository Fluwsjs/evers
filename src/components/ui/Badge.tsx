import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-sand-200 text-ink",
  brand: "bg-brand-soft text-brand-strong",
  dark: "bg-ink text-white",
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

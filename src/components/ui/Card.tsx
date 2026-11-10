import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  as?: "div" | "article" | "li";
  className?: string;
}

export function Card({ children, as: Tag = "div", className }: CardProps) {
  return (
    <Tag className={cn("rounded-card border border-line bg-white p-6 text-ink shadow-card", className)}>{children}</Tag>
  );
}

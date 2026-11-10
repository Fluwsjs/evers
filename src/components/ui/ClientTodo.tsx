import { showTodos } from "@/lib/site";

/**
 * Zichtbare markering voor gegevens die de klant nog moet aanleveren.
 * Alleen tijdens de bouw zichtbaar (zie `showTodos`); in productie rendert dit niets.
 */
export function ClientTodo({ children }: { children: string }) {
  if (!showTodos) return null;
  return (
    <span className="inline-block rounded border border-dashed border-current px-1.5 py-0.5 text-xs font-medium">
      TODO klant: {children}
    </span>
  );
}

import { cn } from "../../lib/cn";

/** Bloco de carregamento (skeleton) para estados que ainda não têm dados. */
export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-ink-100", className)} />;
}

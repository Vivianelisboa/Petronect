import { Search, X } from "lucide-react";
import { cn } from "../../lib/cn";

/** Campo de busca compacto para listas operacionais. */
export function SearchField({ value, onChange, placeholder, className }) {
  return (
    <div className={cn("relative", className)}>
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-ink-200 bg-white pl-9 pr-9 text-sm text-ink-800 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-400 hover:bg-ink-50 hover:text-ink-700"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

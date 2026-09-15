/**
 * Marca do produto. A logo é a própria wordmark "portal njila" na fonte
 * Garet (Book), então é renderizada como texto — sem imagem.
 */
export function Header() {
  return (
    <header className="flex items-center border-b border-slate-200 bg-white px-6 py-4">
      <span
        className="text-xl leading-none tracking-tight text-ink-900"
        aria-label="portal njila"
      >
        portal njila
      </span>
    </header>
  );
}

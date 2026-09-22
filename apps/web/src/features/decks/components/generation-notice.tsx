import { Info } from 'lucide-react'

// Shown once the stand-in has walked its steps. The one warning on the screen, so it takes the
// secondary colour rather than the accent the informational notices use.
export function GenerationNotice() {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-secondary bg-secondary/10 px-4 py-3.5"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary"
      >
        <Info className="size-3 text-secondary-foreground" />
      </span>

      <span className="flex flex-col gap-1">
        <span className="font-semibold text-sm">Generation is not connected yet</span>
        <span className="text-pretty text-muted-foreground text-sm leading-relaxed">
          Those steps were a stand-in, so this deck arrived with no cards. Nothing was written for
          you. Write the first card yourself and it stays.
        </span>
      </span>
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import { ChevronRight, Plus } from 'lucide-react'
import type { MouseEvent } from 'react'

type NewDeckBannerProps = {
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export function NewDeckBanner({ onClick }: NewDeckBannerProps) {
  return (
    <Link
      to="/decks/new"
      onClick={onClick}
      className="flex items-center gap-5 rounded-xl bg-primary p-5 text-primary-foreground shadow-md outline-offset-2 outline-ring transition-all duration-150 hover:-translate-y-px hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_12%)] focus-visible:outline-2"
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-foreground/15"
      >
        <Plus className="size-6" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-pretty font-semibold text-xl tracking-tight">
          Create a flashcard deck
        </span>
        <span className="text-pretty text-accent text-sm">
          Make a flashcard deck from your PDF documents.
        </span>
      </span>

      <ChevronRight className="size-5 shrink-0 opacity-80" aria-hidden="true" />
    </Link>
  )
}

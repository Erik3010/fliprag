import type { LibraryCounts } from '@/features/decks/types'

export function CountTiles({ counts }: { counts: LibraryCounts }) {
  const tiles = [
    { label: 'Decks', value: counts.decks },
    { label: 'Cards', value: counts.cards },
    { label: 'Docs', value: counts.documents },
  ]

  return (
    <dl className="grid grid-cols-3 gap-3.5">
      {tiles.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col gap-1.5 rounded-lg border bg-card px-5 py-4 shadow-xs"
        >
          <dt className="text-muted-foreground/80 text-xs uppercase tracking-wider font-medium">
            {label}
          </dt>
          <dd className="font-semibold text-3xl leading-none tracking-tight tabular-nums">
            {value === null ? (
              <output
                aria-label="Loading"
                className="block h-7 w-10 animate-pulse rounded bg-muted"
              />
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

import { Button } from '@fliprag/ui/components/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Plus, Upload } from 'lucide-react'
import type { ComponentType } from 'react'
import { DeckList } from '@/features/decks/components/deck-list'
import { placeholderCounts, placeholderDecks } from '@/features/decks/placeholder'
import type { LibraryCounts } from '@/features/decks/types'
import { placeholderLatestDocument } from '@/features/documents/placeholder'

export const Route = createFileRoute('/_app/')({
  component: Home,
})

const today = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

// TODO: load decks, counts, and the latest document from the server. Placeholder rows until then.
function Home() {
  const decks = placeholderDecks
  const counts = placeholderCounts
  const latest = counts.documents > 0 ? placeholderLatestDocument : undefined

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            {today.format(new Date())}
          </p>

          {/* TODO: greet with the account's own name once one is stored. Hard coded until then. */}
          <h1 className="mt-1.5 text-balance font-semibold text-3xl tracking-tight">
            Good morning, Maya
          </h1>
        </div>

        <Button asChild variant="outline">
          <Link to="/documents">
            <Upload aria-hidden="true" />
            Upload PDF
          </Link>
        </Button>
      </header>

      {latest ? (
        <NextStep
          to="/decks/new"
          icon={Plus}
          title="Create a deck"
          line={`From ${latest.name}. Cards are written by hand until generation is connected.`}
        />
      ) : (
        <NextStep
          to="/documents"
          icon={Upload}
          title="Upload a PDF"
          line="A deck is made from a document, so this one comes first."
        />
      )}

      <Counts counts={counts} />

      <DeckList decks={decks} />
    </div>
  )
}

type NextStepProps = {
  to: '/decks/new' | '/documents'
  icon: ComponentType<{ className?: string }>
  title: string
  line: string
}

// The one filled element on the page, so the next thing to do needs no looking for.
function NextStep({ to, icon: Icon, title, line }: NextStepProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-5 rounded-xl bg-primary p-5 text-primary-foreground shadow-md outline-offset-2 outline-ring transition-all duration-150 hover:-translate-y-px hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_12%)] focus-visible:outline-2"
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-foreground/15"
      >
        <Icon className="size-6" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-pretty font-semibold text-xl tracking-tight">{title}</span>
        <span className="text-pretty text-accent text-sm">{line}</span>
      </span>

      <ChevronRight className="size-5 shrink-0 opacity-80" aria-hidden="true" />
    </Link>
  )
}

function Counts({ counts }: { counts: LibraryCounts }) {
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
          <dt className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            {label}
          </dt>
          <dd className="font-semibold text-3xl leading-none tracking-tight tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

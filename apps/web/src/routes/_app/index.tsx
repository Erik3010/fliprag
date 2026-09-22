import { Button } from '@fliprag/ui/components/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ChevronRight, Plus, RefreshCw, Upload } from 'lucide-react'
import type { ComponentType } from 'react'
import { DeckList } from '@/features/decks/components/deck-list'
import { DeckListEmpty } from '@/features/decks/components/deck-list-empty'
import { placeholderDecks } from '@/features/decks/placeholder'
import type { LibraryCounts } from '@/features/decks/types'
import { useDocuments } from '@/features/documents/hooks/use-documents'

export const Route = createFileRoute('/_app/')({
  component: Home,
})

// TODO: load decks and their counts from the server. Placeholder rows until then.
function Home() {
  const decks = placeholderDecks
  const { documents, error, retry } = useDocuments()

  const counts = {
    decks: decks.length,
    cards: decks.reduce((total, deck) => total + deck.cardCount, 0),
    documents: documents?.length ?? null,
  }
  const latest = documents?.[0]

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            {format(new Date(), 'EEEE d MMMM')}
          </p>

          {/* TODO: greet with the account's own name once one is stored. Hard coded until then. */}
          <h1 className="mt-1.5 text-balance font-semibold text-3xl tracking-tight">
            Welcome, Maya
          </h1>
        </div>

        <Button asChild variant="outline">
          <Link to="/documents">
            <Upload aria-hidden="true" />
            Upload PDF
          </Link>
        </Button>
      </header>

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-destructive/40 bg-card px-5 py-4"
        >
          <span className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">Your documents could not be loaded</span>
            <span className="text-muted-foreground text-xs">{error}</span>
          </span>
          <Button type="button" variant="outline" size="sm" onClick={retry}>
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        </div>
      ) : documents === undefined ? (
        <div aria-hidden="true" className="h-24 animate-pulse rounded-xl bg-muted" />
      ) : latest ? (
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

      <DeckList
        decks={decks}
        empty={<DeckListEmpty hasDocument={documents !== undefined && documents.length > 0} />}
      />
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

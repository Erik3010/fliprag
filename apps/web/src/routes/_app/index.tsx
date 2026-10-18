import { Button } from '@fliprag/ui/components/button'
import { ErrorState } from '@fliprag/ui/components/error-state'
import { createFileRoute, Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Upload } from 'lucide-react'
import { useState } from 'react'
import { DeckList } from '@/features/decks/components/deck-list'
import { DeckListEmpty } from '@/features/decks/components/deck-list-empty'
import { placeholderDecks } from '@/features/decks/placeholder'
import { useDocuments } from '@/features/documents/hooks/use-documents'
import { useAuthStore } from '@/store/auth'
import { CountTiles } from '../-components/count-tiles'
import { NewDeckBanner } from '../-components/new-deck-banner'
import { UploadPromptDialog } from '../-components/upload-prompt-dialog'

export const Route = createFileRoute('/_app/')({
  component: Home,
})

function Home() {
  const decks = placeholderDecks
  const { documents, error, retry } = useDocuments()
  const email = useAuthStore((state) => state.user?.email)
  const [uploadPromptOpen, setUploadPromptOpen] = useState(false)

  const counts = {
    decks: decks.length,
    cards: decks.reduce((total, deck) => total + deck.cardCount, 0),
    documents: documents?.length ?? null,
  }

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-muted-foreground text-sm capitalize">
            {format(new Date(), 'EEEE d MMMM')}
          </p>

          <h1 className="mt-1.5 text-balance font-semibold text-3xl tracking-tight wrap-anywhere">
            {email ? `Welcome, ${email}` : 'Welcome'}
          </h1>
        </div>

        <Button asChild variant="outline">
          <Link to="/documents">
            <Upload aria-hidden="true" />
            Upload document
          </Link>
        </Button>
      </header>

      {error ? (
        <ErrorState
          title="Documents could not be loaded"
          detail={error}
          onRetry={retry}
          className="px-5 py-4"
        />
      ) : documents === undefined ? (
        <div aria-hidden="true" className="h-24 animate-pulse rounded-xl bg-muted" />
      ) : (
        <NewDeckBanner
          onClick={(event) => {
            if (documents.length === 0) {
              event.preventDefault()
              setUploadPromptOpen(true)
            }
          }}
        />
      )}

      <UploadPromptDialog open={uploadPromptOpen} onOpenChange={setUploadPromptOpen} />

      <CountTiles counts={counts} />

      <DeckList
        decks={decks}
        empty={<DeckListEmpty hasDocument={documents !== undefined && documents.length > 0} />}
      />
    </div>
  )
}

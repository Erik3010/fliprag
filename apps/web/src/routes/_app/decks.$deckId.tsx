import { PageHeading } from '@fliprag/ui/components/page-heading'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/decks/$deckId')({
  component: DeckEditor,
})

function DeckEditor() {
  const { deckId } = Route.useParams()

  return (
    <>
      <PageHeading title="Deck" description={`Editor for deck ${deckId}.`} />

      <p className="mt-8 rounded-lg border border-dashed px-6 py-12 text-center text-muted-foreground">
        This screen is not built yet.
      </p>
    </>
  )
}

import { PageHeading } from '@fliprag/ui/components/page-heading'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/decks/new')({
  component: NewDeck,
})

function NewDeck() {
  return (
    <>
      <PageHeading title="Create a deck" description="Pick a document and name what it covers." />

      <p className="mt-8 rounded-lg border border-dashed px-6 py-12 text-center text-muted-foreground">
        This screen is not built yet.
      </p>
    </>
  )
}

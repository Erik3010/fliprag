import { Button } from '@fliprag/ui/components/button'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { CardList } from '@/features/cards/components/card-list'
import { CardListEmpty } from '@/features/cards/components/card-list-empty'
import { DeckDetails } from '@/features/decks/components/deck-details'
import { DeckEditorHeader } from '@/features/decks/components/deck-editor-header'
import { DeckNotFound } from '@/features/decks/components/deck-not-found'
import { DeckSource } from '@/features/decks/components/deck-source'
import { DeleteDeckDialog } from '@/features/decks/components/delete-deck-dialog'
import { GenerationNotice } from '@/features/decks/components/generation-notice'
import { GenerationProgress } from '@/features/decks/components/generation-progress'
import { UnsavedChangesBar } from '@/features/decks/components/unsaved-changes-bar'
import { useDeckEditor } from '@/features/decks/hooks/use-deck-editor'

export const Route = createFileRoute('/_app/decks/$deckId')({
  head: () => ({ meta: [{ title: 'Deck' }] }),
  component: DeckEditor,
})

function DeckEditor() {
  const { deckId } = Route.useParams()
  const navigate = useNavigate()
  const editor = useDeckEditor(deckId)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const back = (
    <Link
      to="/"
      className="flex items-center gap-1.5 self-start rounded-sm font-medium text-muted-foreground text-sm outline-offset-2 outline-ring transition-colors hover:text-foreground focus-visible:outline-2"
    >
      <ChevronLeft className="size-3.5" aria-hidden="true" />
      All decks
    </Link>
  )

  if (!editor.deck) {
    return (
      <div className="flex flex-col gap-5">
        {back}
        <DeckNotFound />
      </div>
    )
  }

  const { deck, cards, generation } = editor

  return (
    <div className="flex flex-col gap-5">
      {back}

      <DeckEditorHeader
        deckId={deck.id}
        title={editor.title}
        cardCount={cards.length}
        generation={generation}
        onTitleChange={editor.setTitle}
        onDelete={() => setConfirmingDelete(true)}
      />

      <DeckSource documentName={deck.documentName} />

      <DeckDetails
        description={editor.description}
        topics={deck.topics}
        onDescriptionChange={editor.setDescription}
      />

      {generation.walking && <GenerationProgress step={generation.step} />}
      {generation.notConnected && <GenerationNotice />}

      <section aria-labelledby="cards-heading" className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="cards-heading" className="font-semibold text-lg tracking-tight">
            Cards
          </h2>

          <Button type="button" variant="outline" onClick={editor.addCard}>
            <Plus aria-hidden="true" />
            Add a card
          </Button>
        </div>

        {cards.length === 0 ? (
          <CardListEmpty onAdd={editor.addCard} />
        ) : (
          <CardList
            cards={cards}
            focusKey={editor.focusKey}
            onFocused={editor.clearFocus}
            onChange={editor.updateCard}
            onMove={editor.moveCard}
            onDelete={editor.removeCard}
          />
        )}
      </section>

      <UnsavedChangesBar unsaved={editor.unsaved} onSave={editor.save} />

      {/* TODO: delete through the API. Until then leaving the screen is all there is to do. */}
      <DeleteDeckDialog
        open={confirmingDelete}
        title={editor.title}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => navigate({ to: '/' })}
      />
    </div>
  )
}

import { Button } from '@fliprag/ui/components/button'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { CardList } from '@/features/cards/components/card-list'
import { CardListEmpty } from '@/features/cards/components/card-list-empty'
import { DeleteCardDialog } from '@/features/cards/components/delete-card-dialog'
import { DeckNotFound } from '@/features/decks/components/deck-not-found'
import { DeleteDeckDialog } from '@/features/decks/components/editor/delete-dialog'
import { DeckDetails } from '@/features/decks/components/editor/details'
import { GenerationProgress } from '@/features/decks/components/editor/generation-progress'
import { DeckEditorHeader } from '@/features/decks/components/editor/header'
import { DeckSource } from '@/features/decks/components/editor/source'
import { DeckEditorToolbar } from '@/features/decks/components/editor/toolbar'
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
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null)

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
  const deletingIndex = cards.findIndex((card) => card.id === deletingCardId)

  return (
    <div className="flex flex-col gap-5">
      <DeckEditorToolbar
        back={back}
        deckId={deck.id}
        canStudy={cards.length > 0}
        unsaved={editor.unsaved}
        onSave={editor.save}
      />

      <DeckEditorHeader
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

      {(generation.walking || generation.error) && (
        <GenerationProgress step={generation.step} error={generation.error} />
      )}

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
            onDelete={setDeletingCardId}
          />
        )}
      </section>

      <DeleteCardDialog
        position={deletingIndex < 0 ? null : deletingIndex + 1}
        onCancel={() => setDeletingCardId(null)}
        onConfirm={() => {
          if (deletingCardId) {
            editor.removeCard(deletingCardId)
          }
          setDeletingCardId(null)
        }}
      />

      {/* TODO: delete the deck through the API. For now, confirming only goes home. */}
      <DeleteDeckDialog
        open={confirmingDelete}
        title={editor.title}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => navigate({ to: '/' })}
      />
    </div>
  )
}

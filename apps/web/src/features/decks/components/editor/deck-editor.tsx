import { Button } from '@fliprag/ui/components/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CardList } from '@/features/cards/components/card-list'
import { CardListEmpty } from '@/features/cards/components/card-list-empty'
import { DeleteCardDialog } from '@/features/cards/components/delete-card-dialog'
import { DeckBackLink } from '@/features/decks/components/editor/back-link'
import { DeleteDeckDialog } from '@/features/decks/components/editor/delete-dialog'
import { DeckDetails } from '@/features/decks/components/editor/details'
import { GenerationProgress } from '@/features/decks/components/editor/generation-progress'
import { DeckEditorHeader } from '@/features/decks/components/editor/header'
import { DeckSource } from '@/features/decks/components/editor/source'
import { DeckEditorToolbar } from '@/features/decks/components/editor/toolbar'
import { useDeckEditor } from '@/features/decks/hooks/use-deck-editor'
import type { DeckDetail } from '@/features/decks/types'

function studyBlockedReason(locked: boolean, cardCount: number) {
  if (locked) return 'Available once the deck is made'
  if (cardCount === 0) return 'Add at least one card to study'
  return null
}

type DeckEditorProps = {
  deck: DeckDetail
}

export function DeckEditor({ deck }: DeckEditorProps) {
  const editor = useDeckEditor(deck)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null)

  const { cards, generation, locked } = editor
  const deletingIndex = cards.findIndex((card) => card.id === deletingCardId)

  return (
    <div className="flex flex-col gap-5">
      <DeckEditorToolbar
        back={<DeckBackLink />}
        deckId={deck.id}
        studyBlocked={studyBlockedReason(locked, cards.length)}
        unsaved={editor.unsaved}
        saving={editor.saving}
        onSave={editor.save}
      />

      <DeckEditorHeader
        title={editor.title}
        cardCount={cards.length}
        generation={generation}
        locked={locked}
        onTitleChange={editor.setTitle}
        onDelete={() => setConfirmingDelete(true)}
      />

      <DeckSource documentName={deck.document.name} onOpen={editor.openDocument} />

      <DeckDetails
        description={editor.description}
        topics={deck.topics ?? ''}
        locked={locked}
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

          {!locked && (
            <Button type="button" variant="outline" onClick={editor.addCard}>
              <Plus aria-hidden="true" />
              Add a card
            </Button>
          )}
        </div>

        {cards.length === 0 && locked ? (
          <p className="text-muted-foreground text-sm">
            No cards yet. New cards show here as they are generated.
          </p>
        ) : cards.length === 0 ? (
          <CardListEmpty onAdd={editor.addCard} />
        ) : (
          <CardList
            cards={cards}
            locked={locked}
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

      <DeleteDeckDialog
        open={confirmingDelete}
        title={editor.title}
        pending={editor.removing}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={editor.remove}
      />
    </div>
  )
}

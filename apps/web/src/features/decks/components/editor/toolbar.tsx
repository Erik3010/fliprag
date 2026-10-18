import { Button } from '@fliprag/ui/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@fliprag/ui/components/tooltip'
import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import type { ReactNode } from 'react'

type DeckEditorToolbarProps = {
  back: ReactNode
  deckId: string
  canStudy: boolean
  unsaved: boolean
  saving: boolean
  onSave: () => void
}

const shortcut =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘S' : 'Ctrl S'

export function DeckEditorToolbar({
  back,
  deckId,
  canStudy,
  unsaved,
  saving,
  onSave,
}: DeckEditorToolbarProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 -mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b bg-background px-4 py-3 sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-4">
        {back}

        <span role="status" className="flex items-center gap-4">
          {unsaved && (
            <>
              <span aria-hidden="true" className="h-5 w-px bg-border" />
              <span className="flex items-center gap-2 font-medium text-sm">
                <span aria-hidden="true" className="size-2 rounded-full bg-secondary" />
                Unsaved changes
              </span>
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <Button type="button" size="lg" disabled={!unsaved || saving} onClick={onSave}>
          Save changes
          <kbd className="hidden rounded bg-primary-foreground/15 px-1.5 py-0.5 font-sans text-[0.7rem] sm:inline">
            {shortcut}
          </kbd>
        </Button>

        {canStudy ? (
          <Button asChild variant="outline" size="lg">
            <Link to="/decks/$deckId/study" params={{ deckId }}>
              <Play aria-hidden="true" />
              Study
            </Link>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="lg"
                aria-disabled="true"
                className="cursor-not-allowed opacity-50"
              >
                <Play aria-hidden="true" />
                Study
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add at least one card to study</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

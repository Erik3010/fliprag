import { Button } from '@fliprag/ui/components/button'

type UnsavedChangesBarProps = {
  unsaved: boolean
  onSave: () => void
}

const shortcut =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘S' : 'Ctrl S'

export function UnsavedChangesBar({ unsaved, onSave }: UnsavedChangesBarProps) {
  if (!unsaved) {
    return null
  }

  return (
    <section
      aria-label="Unsaved changes"
      className="sticky bottom-4 z-20 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border bg-card px-5 py-4 shadow-lg"
    >
      <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-secondary" />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold text-sm">Unsaved changes</span>
        <span className="text-muted-foreground text-xs">Save to keep your edits.</span>
      </span>

      <Button type="button" className="w-full sm:w-auto" onClick={onSave}>
        Save changes
        <kbd className="hidden rounded bg-primary-foreground/15 px-1.5 py-0.5 font-sans text-[0.7rem] sm:inline">
          {shortcut}
        </kbd>
      </Button>
    </section>
  )
}

type DeckDetailsProps = {
  description: string
  topics: string
  onDescriptionChange: (value: string) => void
  onDescriptionBlur: () => void
}

const label = 'font-mono text-muted-foreground text-xs uppercase tracking-widest'

// The description is edited in place. The topics are shown and not editable: cards written
// against one set of topics do not become cards about another by changing the label.
export function DeckDetails({
  description,
  topics,
  onDescriptionChange,
  onDescriptionBlur,
}: DeckDetailsProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="deck-description" className={label}>
          Description
        </label>
        <textarea
          id="deck-description"
          rows={2}
          value={description}
          onChange={(event) => onDescriptionChange(event.currentTarget.value)}
          onBlur={onDescriptionBlur}
          placeholder="What this deck is for."
          className="-ml-2 field-sizing-content w-full resize-y rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={label}>Topics asked for</span>
        {topics.trim() ? (
          <p className="text-pretty text-sm leading-relaxed">{topics}</p>
        ) : (
          <p className="text-muted-foreground text-sm">
            No topics were set, so the whole document was used.
          </p>
        )}
      </div>
    </section>
  )
}

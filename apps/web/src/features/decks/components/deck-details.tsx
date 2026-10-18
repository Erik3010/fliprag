import { Textarea } from '@fliprag/ui/components/textarea'

type DeckDetailsProps = {
  description: string
  topics: string
  onDescriptionChange: (value: string) => void
}

const label = 'font-medium text-muted-foreground text-xs'

export function DeckDetails({ description, topics, onDescriptionChange }: DeckDetailsProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="deck-description" className={label}>
          Description
        </label>
        <Textarea
          id="deck-description"
          rows={2}
          value={description}
          onChange={(event) => onDescriptionChange(event.currentTarget.value)}
          placeholder="What this deck is for."
          className="min-h-20 resize-y bg-background leading-relaxed transition-[color,background-color,box-shadow] duration-150 hover:bg-card focus-visible:bg-card"
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

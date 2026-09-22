import { cardCount as bounds, type NewDeck, newDeckSchema } from '@fliprag/schemas/deck'
import { Button } from '@fliprag/ui/components/button'
import { FieldError } from '@fliprag/ui/components/field-error'
import { Input } from '@fliprag/ui/components/input'
import { Label } from '@fliprag/ui/components/label'
import { Slider } from '@fliprag/ui/components/slider'
import { Textarea } from '@fliprag/ui/components/textarea'
import { cn } from '@fliprag/ui/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { ArrowRight, FileText, Info } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { DocumentPicker } from '@/features/documents/components/document-picker'
import { documentMeta } from '@/features/documents/format'
import type { SourceDocument } from '@/features/documents/types'

const card = 'flex flex-col rounded-xl border bg-card p-5 shadow-xs'

type NewDeckFormProps = {
  documents: SourceDocument[]
}

export function NewDeckForm({ documents }: NewDeckFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewDeck>({
    resolver: zodResolver(newDeckSchema),
    defaultValues: {
      title: '',
      description: '',
      topics: '',
      documentId: documents[0]?.id ?? '',
      cardCount: bounds.default,
    },
  })

  const documentId = watch('documentId')
  const document = documents.find((doc) => doc.id === documentId)
  const complete = watch('title').trim().length > 0 && document !== undefined

  return (
    // The submit button is never disabled. A disabled button refuses without saying why, and the
    // two things this form needs are the two things it is asking for.
    <form
      onSubmit={handleSubmit(() => setSubmitted(true))}
      noValidate
      className="flex flex-col gap-3.5"
    >
      <section className={cn(card, 'gap-5')}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="deck-title">Title</Label>
          <Input
            id="deck-title"
            placeholder="Cellular respiration"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'deck-title-error' : undefined}
            {...register('title')}
          />
          <FieldError id="deck-title-error" message={errors.title?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="deck-description">
            Description
            <span className="font-normal text-muted-foreground text-xs">optional</span>
          </Label>
          <Textarea
            id="deck-description"
            rows={3}
            placeholder="What this deck is for, in a line or two."
            {...register('description')}
          />
        </div>
      </section>

      <section className={cn(card, 'gap-3')}>
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-medium text-sm">Source document</span>
          <span className="text-muted-foreground text-xs">One per deck</span>
        </div>

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          aria-describedby={errors.documentId ? 'deck-document-error' : undefined}
          className="flex w-full items-center gap-3 rounded-lg border p-3 text-left outline-offset-2 outline-ring transition-colors hover:border-ring hover:bg-muted/50 focus-visible:outline-2"
        >
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent"
          >
            <FileText className="size-4 text-secondary" />
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span
              className={cn('truncate font-medium text-sm', !document && 'text-muted-foreground')}
            >
              {document ? document.name : 'No document chosen'}
            </span>
            <span className="font-mono text-muted-foreground text-xs">
              {document ? documentMeta(document) : 'Required, pick one from your uploads'}
            </span>
          </span>

          <span className="shrink-0 font-semibold text-primary text-xs">
            {document ? 'Change' : 'Choose'}
          </span>
        </button>

        <FieldError id="deck-document-error" message={errors.documentId?.message} />
      </section>

      <section className={cn(card, 'gap-5')}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="deck-topics">
            Topics to cover
            <span className="font-normal text-muted-foreground text-xs">optional</span>
          </Label>
          <Input
            id="deck-topics"
            placeholder="glycolysis, ATP yield, electron transport chain"
            {...register('topics')}
          />
        </div>

        <Controller
          control={control}
          name="cardCount"
          render={({ field }) => (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-sm">Cards to ask for</span>
                <span className="min-w-14 rounded-md bg-accent px-2.5 py-1 text-center font-mono text-accent-foreground text-sm tabular-nums">
                  {field.value}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="font-mono text-muted-foreground text-xs">
                  {bounds.min}
                </span>
                <Slider
                  aria-label="Cards to ask for"
                  min={bounds.min}
                  max={bounds.max}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0] ?? bounds.default)}
                  onBlur={field.onBlur}
                  className="flex-1"
                />
                <span aria-hidden="true" className="font-mono text-muted-foreground text-xs">
                  {bounds.max}
                </span>
              </div>

              <p className="text-pretty text-muted-foreground text-xs leading-relaxed">
                A request, not a promise. If the document does not hold enough to write about you
                get fewer cards, and a deck is never padded to reach the number.
              </p>
            </div>
          )}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <p className="text-muted-foreground text-xs">
          {complete
            ? 'Saving is not connected yet.'
            : 'A title and a source document are required.'}
        </p>

        <div className="flex gap-2.5">
          <Button asChild variant="outline" size="lg">
            <Link to="/">Cancel</Link>
          </Button>

          <Button type="submit" size="lg" className="px-5">
            Create deck
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>

      {submitted && (
        <div className="flex items-center gap-3 rounded-xl border border-ring bg-accent px-4 py-3.5 text-accent-foreground text-sm">
          <span
            aria-hidden="true"
            className="grid size-5 shrink-0 place-items-center rounded-full bg-primary"
          >
            <Info className="size-3 text-primary-foreground" />
          </span>
          <span>
            The form is complete. Nothing is saved, because the deck API is not built yet.
          </span>
        </div>
      )}

      <DocumentPicker
        documents={documents}
        selectedId={documentId}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(next) => {
          setValue('documentId', next.id, { shouldValidate: true })
          setPickerOpen(false)
        }}
      />
    </form>
  )
}

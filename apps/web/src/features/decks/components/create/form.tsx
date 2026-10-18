import { cardCount as bounds, type NewDeck, newDeckSchema } from '@fliprag/schemas/deck'
import { Button } from '@fliprag/ui/components/button'
import { FieldError } from '@fliprag/ui/components/field-error'
import { Input } from '@fliprag/ui/components/input'
import { Label } from '@fliprag/ui/components/label'
import { Textarea } from '@fliprag/ui/components/textarea'
import { cn } from '@fliprag/ui/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CardCountField } from '@/features/decks/components/create/card-count-field'
import { OptionalBadge } from '@/features/decks/components/create/optional-badge'
import { SourceDocumentField } from '@/features/decks/components/create/source-document-field'
import { DocumentPicker } from '@/features/documents/components/document-picker'
import type { SourceDocument } from '@/features/documents/types'

const card = 'flex flex-col rounded-xl border bg-card p-5 shadow-xs'

type NewDeckFormProps = {
  documents: SourceDocument[]
  onSubmit: (deck: NewDeck) => void
  pending: boolean
  error?: string
}

export function NewDeckForm({ documents, onSubmit, pending, error }: NewDeckFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

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
      documentId: '',
      cardCount: bounds.default,
    },
  })

  const documentId = watch('documentId')
  const document = documents.find((doc) => doc.id === documentId)
  const complete = watch('title').trim().length > 0 && document !== undefined
  const hint = error ?? (complete ? null : 'A title and a source document are required.')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5">
      <section className={cn(card, 'gap-5')}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="deck-title">Title</Label>
          <Input
            id="deck-title"
            placeholder="e.g. The solar system"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'deck-title-error' : undefined}
            {...register('title')}
          />
          <FieldError id="deck-title-error" message={errors.title?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="deck-description" className="gap-1.5">
            Description
            <OptionalBadge />
          </Label>
          <Textarea
            id="deck-description"
            rows={3}
            placeholder="e.g. For my science exam"
            {...register('description')}
          />
        </div>
      </section>

      <section className={cn(card, 'gap-3')}>
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-medium text-sm">Source document</span>
          <span className="text-muted-foreground text-xs">Required</span>
        </div>

        <SourceDocumentField
          document={document}
          errorId={errors.documentId ? 'deck-document-error' : undefined}
          onBrowse={() => setPickerOpen(true)}
        />

        <FieldError id="deck-document-error" message={errors.documentId?.message} />
      </section>

      <section className={cn(card, 'gap-5')}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="deck-topics" className="gap-1.5">
            Topics to cover
            <OptionalBadge />
          </Label>
          <Input
            id="deck-topics"
            placeholder="e.g. planets, the sun, moons"
            {...register('topics')}
          />
        </div>

        <Controller
          control={control}
          name="cardCount"
          render={({ field }) => (
            <CardCountField value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
          )}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {hint && (
          <p
            role={error && 'alert'}
            className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}
          >
            {hint}
          </p>
        )}

        <div className="ml-auto flex gap-2.5">
          <Button asChild variant="outline" size="lg">
            <Link to="/">Cancel</Link>
          </Button>

          <Button type="submit" size="lg" disabled={pending}>
            Create deck
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>

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

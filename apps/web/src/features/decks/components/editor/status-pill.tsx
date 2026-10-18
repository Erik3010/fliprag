import { Loader2 } from 'lucide-react'
import { type Generation, generationSteps } from '@/features/decks/hooks/use-generation-walk'

type StatusPillProps = {
  generation: Generation
}

export function StatusPill({ generation }: StatusPillProps) {
  if (generation.walking) {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-ring bg-accent py-1 pr-2.5 pl-2 font-medium text-accent-foreground">
        <Loader2 className="size-3 animate-spin text-primary" aria-hidden="true" />
        Generating · step {generation.step + 1} of {generationSteps.length}
      </span>
    )
  }

  if (generation.error) {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 py-1 pr-2.5 pl-2 font-medium text-destructive">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-destructive" />
        Generation failed
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full border bg-muted py-1 pr-2.5 pl-2 font-medium text-foreground">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-ring" />
      Ready
    </span>
  )
}

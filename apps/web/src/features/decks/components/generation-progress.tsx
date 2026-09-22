import { cn } from '@fliprag/ui/lib/utils'
import { Check, Loader2 } from 'lucide-react'
import { generationSteps } from '@/features/decks/hooks/use-generation-walk'

type GenerationProgressProps = {
  /** Index of the step that is running. Everything before it is done. */
  step: number
}

// Steps rather than a spinner, so slow can be told apart from stuck.
export function GenerationProgress({ step }: GenerationProgressProps) {
  return (
    <section
      aria-label="Making this deck"
      className="flex flex-col gap-3.5 rounded-xl border border-ring bg-card p-5 shadow-xs"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-semibold tracking-tight">Making this deck</h2>
        <span className="font-mono text-muted-foreground text-xs">
          Step {Math.min(step + 1, generationSteps.length)} of {generationSteps.length}
        </span>
      </div>

      <ol className="flex flex-col">
        {generationSteps.map((label, index) => {
          const done = index < step
          const running = index === step

          return (
            <li
              key={label}
              className="flex items-center gap-3 border-muted border-b py-2.5 last:border-b-0"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-full',
                  done && 'bg-primary text-primary-foreground',
                  running && 'border border-ring bg-card',
                  !done && !running && 'border border-dashed bg-card',
                )}
              >
                {done && <Check className="size-3" strokeWidth={2.5} />}
                {running && <Loader2 className="size-3 animate-spin text-primary" />}
              </span>

              <span
                className={cn(
                  'flex-1 text-sm',
                  running ? 'font-semibold' : done ? '' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>

              <span
                className={cn(
                  'font-mono text-xs uppercase tracking-widest',
                  done && 'text-primary',
                  running && 'text-accent-foreground',
                  !done && !running && 'text-muted-foreground',
                )}
              >
                {done ? 'Done' : running ? 'Running' : 'Waiting'}
              </span>
            </li>
          )
        })}
      </ol>

      <p className="text-pretty text-muted-foreground text-xs leading-relaxed">
        Cards appear here as they are written. You can leave this page and come back, the deck keeps
        whatever the work has finished.
      </p>
    </section>
  )
}

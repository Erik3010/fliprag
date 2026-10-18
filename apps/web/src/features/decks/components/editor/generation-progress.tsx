import { cn } from '@fliprag/ui/lib/utils'
import { Check, Loader2, X } from 'lucide-react'
import { generationSteps } from '@/features/decks/hooks/use-generation-walk'

type GenerationProgressProps = {
  /** Index of the current step. Everything before it is done. */
  step: number
  /** Set when the running step failed. */
  error: string | null
}

type StepState = 'done' | 'running' | 'failed' | 'waiting'

type StepStyle = { label: string; mark: string; text: string; status: string }

const stepStyles: Record<StepState, StepStyle> = {
  done: {
    label: 'Done',
    mark: 'bg-primary text-primary-foreground',
    text: '',
    status: 'text-primary',
  },
  running: {
    label: 'Running',
    mark: 'border border-ring bg-card',
    text: 'font-semibold',
    status: 'text-accent-foreground',
  },
  failed: {
    label: 'Failed',
    mark: 'bg-destructive text-destructive-foreground',
    text: 'font-semibold',
    status: 'font-medium text-destructive',
  },
  waiting: {
    label: 'Waiting',
    mark: 'border border-dashed bg-card',
    text: 'text-muted-foreground',
    status: 'text-muted-foreground',
  },
}

function stepState(index: number, step: number, error: string | null): StepState {
  if (index < step) return 'done'
  if (index > step) return 'waiting'
  return error ? 'failed' : 'running'
}

export function GenerationProgress({ step, error }: GenerationProgressProps) {
  return (
    <section
      aria-label="Making this deck"
      className="flex flex-col gap-3.5 rounded-xl border border-ring bg-card p-5 shadow-xs"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-semibold tracking-tight">Making this deck</h2>
        <span className="text-muted-foreground text-xs">
          Step {step + 1} of {generationSteps.length}
        </span>
      </div>

      <ol className="flex flex-col">
        {generationSteps.map((label, index) => {
          const state = stepState(index, step, error)
          const styles = stepStyles[state]

          return (
            <li
              key={label}
              className="flex items-center gap-3 border-muted border-b py-2.5 last:border-b-0"
            >
              <span
                aria-hidden="true"
                className={cn('grid size-5 shrink-0 place-items-center rounded-full', styles.mark)}
              >
                {state === 'done' && <Check className="size-3" strokeWidth={2.5} />}
                {state === 'failed' && <X className="size-3" strokeWidth={2.5} />}
                {state === 'running' && <Loader2 className="size-3 animate-spin text-primary" />}
              </span>

              <span className="flex flex-1 flex-col gap-0.5">
                <span className={cn('text-sm', styles.text)}>{label}</span>
                {state === 'failed' && (
                  <span role="alert" className="text-destructive text-xs">
                    {error}
                  </span>
                )}
              </span>

              <span className={cn('text-xs', styles.status)}>{styles.label}</span>
            </li>
          )
        })}
      </ol>

      <p className="text-pretty text-muted-foreground text-xs leading-relaxed">
        {error ? 'Add cards manually below.' : 'Runs in the background. Safe to leave this page.'}
      </p>
    </section>
  )
}

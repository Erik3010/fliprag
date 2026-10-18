import { cardCount as bounds } from '@fliprag/schemas/deck'
import { Slider } from '@fliprag/ui/components/slider'

type CardCountFieldProps = {
  value: number
  onChange: (value: number) => void
  onBlur: () => void
}

export function CardCountField({ value, onChange, onBlur }: CardCountFieldProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-sm">Card count</span>
        <span className="min-w-14 rounded-md bg-accent px-2.5 py-1 text-center text-accent-foreground text-xs tabular-nums">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="text-muted-foreground text-xs">
          {bounds.min}
        </span>
        <Slider
          aria-label="Card count"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={[value]}
          onValueChange={(next) => onChange(next[0] ?? bounds.default)}
          onBlur={onBlur}
          className="flex-1"
        />
        <span aria-hidden="true" className="text-muted-foreground text-xs">
          {bounds.max}
        </span>
      </div>
    </div>
  )
}

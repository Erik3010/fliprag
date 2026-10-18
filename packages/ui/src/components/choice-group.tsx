import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import type * as React from 'react'
import { cn } from '../lib/utils'

function ChoiceGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="choice-group"
      className={cn('grid gap-2.5', className)}
      {...props}
    />
  )
}

type ChoiceCardProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'children'> & {
  label: string
  description?: string
}

function ChoiceCard({ label, description, className, ...props }: ChoiceCardProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="choice-card"
      className={cn(
        'group flex cursor-pointer items-start gap-2.5 rounded-xl border bg-card px-4 py-3.5 text-left outline-offset-2 outline-ring transition-colors hover:border-ring focus-visible:outline-2 data-[state=checked]:border-primary data-[state=checked]:ring-3 data-[state=checked]:ring-accent',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 rounded-full border bg-card group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary"
      />
      <span className="flex flex-col gap-1.5">
        <span className="font-semibold text-sm">{label}</span>
        {description && (
          <span className="text-muted-foreground text-xs leading-relaxed">{description}</span>
        )}
      </span>
    </RadioGroupPrimitive.Item>
  )
}

export { ChoiceCard, ChoiceGroup }

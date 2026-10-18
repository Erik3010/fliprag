import type * as React from 'react'
import { cn } from '../lib/utils'

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex items-center rounded-md border bg-card px-1.5 py-px font-sans text-foreground text-xs shadow-xs',
        className,
      )}
      {...props}
    />
  )
}

export { Kbd }

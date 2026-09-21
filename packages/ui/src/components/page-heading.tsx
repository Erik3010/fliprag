import { cn } from 'cn'
import type * as React from 'react'

type PageHeadingProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  title: string
  description?: string
}

export function PageHeading({ className, title, description, ...props }: PageHeadingProps) {
  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      <h1 className="text-balance font-semibold text-xl tracking-tight">{title}</h1>
      {description && <p className="text-pretty text-muted-foreground text-sm">{description}</p>}
    </div>
  )
}

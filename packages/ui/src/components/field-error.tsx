import type * as React from 'react'
import { cn } from '../lib/utils'

type FieldErrorProps = Omit<React.ComponentProps<'p'>, 'children'> & {
  message?: string
}

export function FieldError({ className, message, ...props }: FieldErrorProps) {
  if (!message) {
    return null
  }

  return (
    <p role="alert" className={cn('text-destructive text-sm', className)} {...props}>
      {message}
    </p>
  )
}

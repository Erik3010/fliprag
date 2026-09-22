import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { Toaster as Sonner, type ToasterProps, toast } from 'sonner'
import { cn } from '../lib/utils'
import { buttonVariants } from './button'

// Unstyled, then dressed as one of the app's cards, so a toast reads like the dialog and the
// rows rather than like Sonner. Pinned to light: there is no dark palette, see globals.css.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-primary" />,
        info: <InfoIcon className="size-4 text-primary" />,
        warning: <TriangleAlertIcon className="size-4 text-secondary" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-full items-center gap-3 rounded-xl border bg-card py-3 pr-3 pl-4 font-sans text-card-foreground text-sm shadow-lg',
          icon: 'shrink-0',
          content: 'flex min-w-0 flex-1 flex-col gap-0.5',
          title: 'font-medium',
          description: 'text-muted-foreground text-xs',
          actionButton: cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'shrink-0'),
          cancelButton: cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'shrink-0'),
          closeButton: cn(buttonVariants({ variant: 'ghost', size: 'icon-xs' }), 'shrink-0'),
        },
      }}
      {...props}
    />
  )
}

// Apps do not depend on sonner themselves, so the way to raise a toast is through here too.
export { Toaster, toast }

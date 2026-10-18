import { FileText } from 'lucide-react'

export function DocumentIcon() {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent"
    >
      <FileText className="size-4 text-accent-foreground" />
    </span>
  )
}

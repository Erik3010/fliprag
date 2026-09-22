// Three stacked rules, widest first, standing for a deck of cards. Used wherever a deck appears.
export function DeckMark() {
  return (
    <span aria-hidden="true" className="flex w-8 flex-col gap-1 pt-0.5">
      <span className="h-1 rounded-xs bg-primary" />
      <span className="h-1 w-4/5 rounded-xs bg-ring" />
      <span className="h-1 w-3/5 rounded-xs bg-border" />
    </span>
  )
}

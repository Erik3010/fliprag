export type Card = {
  id: string
  /** Plain text in phase 1. Stored as an HTML subset so a later phase can add bold and italic. */
  front: string
  back: string
}

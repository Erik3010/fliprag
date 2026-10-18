import type { DeckProgress } from '@/features/decks/types'

export const generationSteps = ['Retrieving context', 'Generating cards'] as const

// The step values the server stores, in the same order as the labels above.
const stepKeys: DeckProgress['step'][] = ['finding', 'writing']

export type Generation = { walking: boolean; step: number; error: string | null }

export function generationOf(progress: DeckProgress | null): Generation {
  if (!progress) {
    return { walking: false, step: 0, error: null }
  }
  const step = Math.max(0, stepKeys.indexOf(progress.step))
  if (progress.status === 'failed') {
    return { walking: false, step, error: progress.error ?? 'Generation failed.' }
  }
  return { walking: true, step, error: null }
}

import { useEffect, useState } from 'react'
import type { DeckStatus } from '@/features/decks/types'

// TODO (phase 2): replace this timer with progress from the server. The steps stay the same.
export const generationSteps = [
  'Reading the document',
  'Finding the passages that match the topics',
  'Writing the cards',
] as const

const STEP_PACE_MS = 1500

export function useGenerationWalk(status: DeckStatus | undefined) {
  const [step, setStep] = useState(0)
  const walking = status === 'generating' && step < generationSteps.length

  useEffect(() => {
    if (!walking) {
      return
    }
    const timer = setTimeout(() => setStep(step + 1), STEP_PACE_MS)
    return () => clearTimeout(timer)
  }, [walking, step])

  return {
    walking,
    step,
    // The stand-in is done, and wrote no cards.
    notConnected: status === 'generating' && !walking,
  }
}

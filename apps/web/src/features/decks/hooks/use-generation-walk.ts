import { useEffect, useState } from 'react'
import type { DeckStatus } from '@/features/decks/types'

// The three steps the real pipeline will report into. Phase 2 replaces the timer below with what
// the server says, and the screen stays as it is.
export const generationSteps = [
  'Reading the document',
  'Finding the passages that match the topics',
  'Writing the cards',
] as const

const STEP_PACE_MS = 1500

// Walks the steps for a deck that is still being made. A ready deck never starts.
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
    // The stand-in has finished and, this being phase 1, wrote nothing.
    notConnected: status === 'generating' && !walking,
  }
}

import { useEffect, useState } from 'react'
import type { DeckStatus } from '@/features/decks/types'

// TODO (phase 2): replace this timer with progress from the server. The steps stay the same.
export const generationSteps = ['Retrieving context', 'Generating cards'] as const

const STEP_PACE_MS = 1500
const LAST_STEP = generationSteps.length - 1

export function useGenerationWalk(status: DeckStatus | undefined) {
  const [step, setStep] = useState(0)
  const [failed, setFailed] = useState(false)
  const walking = status === 'generating' && !failed

  useEffect(() => {
    if (!walking) {
      return
    }
    const timer = setTimeout(
      () => (step < LAST_STEP ? setStep(step + 1) : setFailed(true)),
      STEP_PACE_MS,
    )
    return () => clearTimeout(timer)
  }, [walking, step])

  return {
    walking,
    step,
    // The stand-in has no generator behind it, so it always fails on the last step.
    error: status === 'generating' && failed ? 'Failed to write cards.' : null,
  }
}

export type Generation = ReturnType<typeof useGenerationWalk>

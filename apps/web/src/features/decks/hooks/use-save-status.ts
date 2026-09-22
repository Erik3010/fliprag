import { useCallback, useEffect, useRef, useState } from 'react'

const SAVED_FLASH_MS = 2800

// The "Saved just now" indicator. Fields are touched as they change and committed when left, so
// leaving a field that was never changed is not a save. A move saves at once with flash().
// TODO: commit() and flash() are where the API calls go once there is one.
export function useSaveStatus() {
  const [savedKey, setSavedKey] = useState<string | null>(null)
  const dirty = useRef(new Set<string>())
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const flash = useCallback((key: string) => {
    clearTimeout(timer.current)
    setSavedKey(key)
    timer.current = setTimeout(() => setSavedKey(null), SAVED_FLASH_MS)
  }, [])

  const touch = useCallback((key: string) => {
    dirty.current.add(key)
  }, [])

  const commit = useCallback(
    (key: string) => {
      if (dirty.current.delete(key)) {
        flash(key)
      }
    },
    [flash],
  )

  return { savedKey, touch, commit, flash }
}

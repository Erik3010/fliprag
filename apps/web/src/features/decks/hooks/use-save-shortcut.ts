import { useEffect } from 'react'

// Bound even when disabled, so ⌘S never opens the browser's Save Page dialog.
export function useSaveShortcut(onSave: () => void, enabled: boolean) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        if (enabled) {
          onSave()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onSave, enabled])
}

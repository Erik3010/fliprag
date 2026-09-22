import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// twMerge is the part the plain `cn` package was missing: when two classes set the same Tailwind
// property, the later one wins instead of both being emitted and CSS source order deciding. That is
// what lets a className prop actually override a component's own styles.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

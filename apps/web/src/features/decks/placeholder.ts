import type { Deck, LibraryCounts } from '@/features/decks/types'
import { placeholderDocuments } from '@/features/documents/placeholder'

// Stand-in rows so the home screen can be built before the API exists. Nothing here is real.
// Delete this file once decks are loaded from the server.

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString()
}

export const placeholderDecks: Deck[] = [
  {
    id: '1',
    title: 'Cellular respiration',
    cardCount: 24,
    documentName: 'Bio-201 Lecture 4.pdf',
    updatedAt: daysAgo(0),
  },
  {
    id: '2',
    title: 'Enzyme kinetics',
    cardCount: 18,
    documentName: 'Bio-201 Lecture 4.pdf',
    updatedAt: daysAgo(2),
  },
  {
    id: '3',
    title: 'Membrane transport',
    cardCount: 31,
    documentName: 'Campbell Ch.7 excerpt.pdf',
    updatedAt: daysAgo(5),
  },
  {
    id: '4',
    title: 'Photosynthesis',
    cardCount: 12,
    documentName: 'Bio-201 Lecture 2.pdf',
    updatedAt: daysAgo(11),
  },
  {
    id: '5',
    title: 'Genetic recombination',
    cardCount: 27,
    documentName: 'Campbell Ch.7 excerpt.pdf',
    updatedAt: daysAgo(18),
  },
  {
    id: '6',
    title: 'Protein folding',
    cardCount: 9,
    documentName: 'Bio-201 Lecture 2.pdf',
    updatedAt: daysAgo(26),
  },
  {
    id: '7',
    title: 'Signal transduction',
    cardCount: 22,
    documentName: 'Bio-201 Lecture 4.pdf',
    updatedAt: daysAgo(40),
  },
]

export const placeholderCounts: LibraryCounts = {
  decks: placeholderDecks.length,
  cards: placeholderDecks.reduce((total, deck) => total + deck.cardCount, 0),
  documents: placeholderDocuments.length,
}

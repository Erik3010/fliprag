import { subDays } from 'date-fns'
import type { Card } from '@/features/cards/types'
import type { Deck, DeckDetail } from '@/features/decks/types'

// Stand-in rows so the home screen and the editor can be built before the API exists. Nothing
// here is real. Delete this file once decks and cards are loaded from the server.

function daysAgo(days: number) {
  return subDays(new Date(), days).toISOString()
}

// Keyed by deck id. Decks with no entry open on the empty state.
export const placeholderCards: Record<string, Card[]> = {
  '1': [
    {
      id: 'c1',
      front: 'What is the net ATP yield of glycolysis per glucose?',
      back: '2 ATP (4 produced, 2 consumed) plus 2 NADH.',
    },
    {
      id: 'c2',
      front: 'Where does the citric acid cycle take place?',
      back: 'In the mitochondrial matrix.',
    },
    {
      id: 'c3',
      front: 'What is the final electron acceptor of the electron transport chain?',
      back: 'Oxygen, which is reduced to water.',
    },
  ],
  '2': [
    {
      id: 'c4',
      front: 'What does Km measure?',
      back: 'The substrate concentration at which the reaction runs at half of Vmax.',
    },
    {
      id: 'c5',
      front: 'How does a competitive inhibitor change Vmax and Km?',
      back: 'Vmax stays the same, Km goes up.',
    },
  ],
}

type Row = Omit<DeckDetail, 'cardCount'>

const rows: Row[] = [
  // The one deck still being made, so the editor's progress steps have something to walk.
  {
    id: '8',
    title: 'Nerve impulses',
    description: '',
    topics: 'resting potential, action potential, myelin',
    documentId: '3',
    documentName: 'Bio-201 Lecture 2.pdf',
    status: 'generating',
    updatedAt: daysAgo(0),
  },
  {
    id: '1',
    title: 'Cellular respiration',
    description:
      'Lecture 4, the whole pathway from glucose to ATP, enough to answer short-answer questions.',
    topics: 'glycolysis, ATP yield, electron transport chain',
    documentId: '1',
    documentName: 'Bio-201 Lecture 4.pdf',
    status: 'ready',
    updatedAt: daysAgo(0),
  },
  {
    id: '2',
    title: 'Enzyme kinetics',
    description: '',
    topics: 'Michaelis-Menten, inhibition',
    documentId: '1',
    documentName: 'Bio-201 Lecture 4.pdf',
    status: 'ready',
    updatedAt: daysAgo(2),
  },
  {
    id: '3',
    title: 'Membrane transport',
    description: '',
    topics: '',
    documentId: '2',
    documentName: 'Campbell Ch.7 excerpt.pdf',
    status: 'ready',
    updatedAt: daysAgo(5),
  },
  {
    id: '4',
    title: 'Photosynthesis',
    description: '',
    topics: '',
    documentId: '3',
    documentName: 'Bio-201 Lecture 2.pdf',
    status: 'ready',
    updatedAt: daysAgo(11),
  },
  {
    id: '5',
    title: 'Genetic recombination',
    description: '',
    topics: '',
    documentId: '2',
    documentName: 'Campbell Ch.7 excerpt.pdf',
    status: 'ready',
    updatedAt: daysAgo(18),
  },
  {
    id: '6',
    title: 'Protein folding',
    description: '',
    topics: '',
    documentId: '3',
    documentName: 'Bio-201 Lecture 2.pdf',
    status: 'ready',
    updatedAt: daysAgo(26),
  },
  {
    id: '7',
    title: 'Signal transduction',
    description: '',
    topics: '',
    documentId: '1',
    documentName: 'Bio-201 Lecture 4.pdf',
    status: 'ready',
    updatedAt: daysAgo(40),
  },
]

// Counted from the cards above, so home and the editor never disagree about a deck.
export const placeholderDeckDetails: DeckDetail[] = rows.map((row) => ({
  ...row,
  cardCount: placeholderCards[row.id]?.length ?? 0,
}))

export const placeholderDecks: Deck[] = placeholderDeckDetails.map(
  ({ id, title, cardCount, documentName, updatedAt }) => ({
    id,
    title,
    cardCount,
    documentName,
    updatedAt,
  }),
)

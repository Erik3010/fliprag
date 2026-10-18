import { subDays } from 'date-fns'
import type { Card } from '@/features/cards/types'
import type { Deck, DeckDetail } from '@/features/decks/types'

// TODO: delete this file once the deck and card APIs exist. Everything in it is fake.

function daysAgo(days: number) {
  return subDays(new Date(), days).toISOString()
}

const decks = {
  cellularRespiration: '0b6f3d2e-4a1c-4f8e-9d27-1c5a8e3b7f01',
  enzymeKinetics: '5e2a9c74-8b13-4d6f-a0e5-2f7b9c1d4e02',
  membraneTransport: '9c4e1b86-2d7a-4e3f-b8c1-3a6d0f5e8b03',
  photosynthesis: 'd17a5f20-6e49-4b8c-9f3d-4b2e7a9c1d04',
  geneticRecombination: '3a8d6e15-7f2b-4c90-8e4a-5c1f3b6d9e05',
  proteinFolding: '7f1c4a93-1b8e-4d25-a6f7-6d3a9e2c5f06',
  signalTransduction: 'b25e8d47-9a3c-4f1b-8d6e-7e4c1a8f3b07',
  nerveImpulses: 'e94b2c68-3d5f-4a7e-9b1c-8f5d2e6a4c08',
}

const documents = {
  lecture4: '4c7e2a19-5b3d-4f8a-9e61-a1d4f7c2b901',
  campbellCh7: '8a3f6d52-2c9e-4b17-8d4a-b2e5a8d3c902',
  lecture2: 'c6d1b8e4-7f2a-4c39-a5e8-c3f6b9e4d903',
}

// Decks missing from here have no cards.
export const placeholderCards: Record<string, Card[]> = {
  [decks.cellularRespiration]: [
    {
      id: '1d5a9e3c-6b2f-4e8d-9a47-d4a7c1e5f101',
      front: 'What is the net ATP yield of glycolysis per glucose?',
      back: '2 ATP (4 produced, 2 consumed) plus 2 NADH.',
    },
    {
      id: '6b9e2d4a-3f8c-4a15-8e72-e5b8d2f6a102',
      front: 'Where does the citric acid cycle take place?',
      back: 'In the mitochondrial matrix.',
    },
    {
      id: 'a2f7c5e8-9d1b-4f63-b8d4-f6c9e3a7b103',
      front: 'What is the final electron acceptor of the electron transport chain?',
      back: 'Oxygen, which is reduced to water.',
    },
  ],
  [decks.enzymeKinetics]: [
    {
      id: 'f3c8d6a1-4e7b-4d92-9c5f-a7d1f4b8c104',
      front: 'What does Km measure?',
      back: 'The substrate concentration at which the reaction runs at half of Vmax.',
    },
    {
      id: '2e6b9f4d-8a3c-4e71-a9d6-b8e2a5c9d105',
      front: 'How does a competitive inhibitor change Vmax and Km?',
      back: 'Vmax stays the same, Km goes up.',
    },
  ],
}

type Row = Omit<DeckDetail, 'cardCount'>

const rows: Row[] = [
  // Still generating, so the editor's progress steps can be seen.
  {
    id: decks.nerveImpulses,
    title: 'Nerve impulses',
    description: '',
    topics: 'resting potential, action potential, myelin',
    documentId: documents.lecture2,
    documentName: 'Bio-201 Lecture 2.pdf',
    status: 'generating',
    updatedAt: daysAgo(0),
  },
  {
    id: decks.cellularRespiration,
    title: 'Cellular respiration',
    description:
      'Lecture 4, the whole pathway from glucose to ATP, enough to answer short-answer questions.',
    topics: 'glycolysis, ATP yield, electron transport chain',
    documentId: documents.lecture4,
    documentName: 'Bio-201 Lecture 4.pdf',
    status: 'ready',
    updatedAt: daysAgo(0),
  },
  {
    id: decks.enzymeKinetics,
    title: 'Enzyme kinetics',
    description: '',
    topics: 'Michaelis-Menten, inhibition',
    documentId: documents.lecture4,
    documentName: 'Bio-201 Lecture 4.pdf',
    status: 'ready',
    updatedAt: daysAgo(2),
  },
  {
    id: decks.membraneTransport,
    title: 'Membrane transport',
    description: '',
    topics: '',
    documentId: documents.campbellCh7,
    documentName: 'Campbell Ch.7 excerpt.pdf',
    status: 'ready',
    updatedAt: daysAgo(5),
  },
  {
    id: decks.photosynthesis,
    title: 'Photosynthesis',
    description: '',
    topics: '',
    documentId: documents.lecture2,
    documentName: 'Bio-201 Lecture 2.pdf',
    status: 'ready',
    updatedAt: daysAgo(11),
  },
  {
    id: decks.geneticRecombination,
    title: 'Genetic recombination',
    description: '',
    topics: '',
    documentId: documents.campbellCh7,
    documentName: 'Campbell Ch.7 excerpt.pdf',
    status: 'ready',
    updatedAt: daysAgo(18),
  },
  {
    id: decks.proteinFolding,
    title: 'Protein folding',
    description: '',
    topics: '',
    documentId: documents.lecture2,
    documentName: 'Bio-201 Lecture 2.pdf',
    status: 'ready',
    updatedAt: daysAgo(26),
  },
  {
    id: decks.signalTransduction,
    title: 'Signal transduction',
    description: '',
    topics: '',
    documentId: documents.lecture4,
    documentName: 'Bio-201 Lecture 4.pdf',
    status: 'ready',
    updatedAt: daysAgo(40),
  },
]

// Counted from the cards above, so home and the editor always agree.
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

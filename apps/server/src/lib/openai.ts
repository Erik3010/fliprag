import { createOpenAI } from '@ai-sdk/openai'
import { embed, embedMany, Output, streamText } from 'ai'
import { z } from 'zod'
import { requireEnv } from './env.js'

const {
  OPENAI_API_KEY: apiKey,
  OPENAI_EMBEDDING_MODEL: embeddingModelId,
  OPENAI_GENERATION_MODEL: generationModelId,
} = requireEnv('OPENAI_API_KEY', 'OPENAI_EMBEDDING_MODEL', 'OPENAI_GENERATION_MODEL')

const openai = createOpenAI({ apiKey })
const embeddingModel = openai.embeddingModel(embeddingModelId)
const generationModel = openai(generationModelId)

const cardSchema = z.object({ front: z.string(), back: z.string() })

export type WrittenCard = z.infer<typeof cardSchema>

export async function embedTexts(values: string[]) {
  const { embeddings } = await embedMany({ model: embeddingModel, values, maxRetries: 0 })
  return embeddings
}

export async function embedText(value: string) {
  const { embedding } = await embed({ model: embeddingModel, value, maxRetries: 0 })
  return embedding
}

// A failed call ends the stream quietly, so the error is rethrown after it.
export async function* streamCards(
  system: string,
  prompt: string,
  maxCards: number,
): AsyncGenerator<WrittenCard> {
  let failure: unknown
  const result = streamText({
    model: generationModel,
    system,
    prompt,
    output: Output.array({ element: cardSchema, maxItems: maxCards }),
    maxRetries: 0,
    onError: ({ error }) => {
      failure = error
    },
  })

  yield* result.elementStream
  if (failure) {
    throw failure
  }
}

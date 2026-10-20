import { createOpenAI } from '@ai-sdk/openai'
import { embed, embedMany } from 'ai'
import { requireEnv } from './env.js'

const { OPENAI_API_KEY: apiKey, OPENAI_EMBEDDING_MODEL: embeddingModelId } = requireEnv(
  'OPENAI_API_KEY',
  'OPENAI_EMBEDDING_MODEL',
)

const openai = createOpenAI({ apiKey })
const embeddingModel = openai.embeddingModel(embeddingModelId)

export async function embedTexts(values: string[]) {
  const { embeddings } = await embedMany({ model: embeddingModel, values, maxRetries: 0 })
  return embeddings
}

export async function embedText(value: string) {
  const { embedding } = await embed({ model: embeddingModel, value, maxRetries: 0 })
  return embedding
}

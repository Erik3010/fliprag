import * as generateDeck from './generate-deck.js'
import * as processDocument from './process-document.js'

// All background jobs. To add one: create jobs/<name>.ts with a start(), then list it here.
const jobs = [processDocument, generateDeck]

export function startJobs() {
  for (const job of jobs) {
    job.start()
  }
}

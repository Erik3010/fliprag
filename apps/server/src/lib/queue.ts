import { PgBoss } from 'pg-boss'
import { requireEnv } from './env.js'

const { DATABASE_URL } = requireEnv('DATABASE_URL')

const boss = new PgBoss(DATABASE_URL)
boss.on('error', (error) => console.error('Job queue error:', error))
const started = boss.start()

export function createQueue<Data extends object>(name: string) {
  // Failed jobs are not retried. Each key has at most one job waiting and one running.
  const ready = started.then(() => boss.createQueue(name, { policy: 'stately', retryLimit: 0 }))
  ready.catch(() => {}) // reported where add or work awaits it

  return {
    async add(key: string, data: Data) {
      await ready
      await boss.send(name, data, { singletonKey: key })
    },
    async work(handler: (data: Data) => Promise<void>) {
      await ready
      await boss.work<Data>(name, { localConcurrency: 1 }, async ([job]) => {
        if (job) {
          await handler(job.data)
        }
      })
    },
  }
}

export function stopQueues() {
  return boss.stop({ graceful: true })
}

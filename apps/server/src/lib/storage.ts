import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { requireEnv } from './env.js'
import { HttpError } from './http-error.js'

export type Storage = {
  put(key: string, bytes: Uint8Array): Promise<void>
  get(key: string): Promise<Uint8Array>
  signedUrl(key: string, filename: string): Promise<string>
  delete(key: string): Promise<void>
  ping(): Promise<void>
}

const {
  R2_ACCOUNT_ID: accountId,
  R2_ACCESS_KEY_ID: accessKeyId,
  R2_SECRET_ACCESS_KEY: secretAccessKey,
  R2_BUCKET: bucket,
} = requireEnv('R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET')

const NOT_FOUND = 'File not found.'
const LINK_SECONDS = 5 * 60

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
})

async function call<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }
    if (error instanceof NoSuchKey || (error instanceof Error && error.name === 'NotFound')) {
      throw new HttpError(404, NOT_FOUND)
    }
    throw new HttpError(503, 'File storage is not reachable.', error)
  }
}

export const storage: Storage = {
  put(key, bytes) {
    return call(async () => {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: bytes,
          ContentType: 'application/pdf',
        }),
      )
    })
  },
  get(key) {
    return call(async () => {
      const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
      if (!object.Body) {
        throw new HttpError(404, NOT_FOUND)
      }
      return object.Body.transformToByteArray()
    })
  },
  signedUrl(key, filename) {
    return call(async () => {
      // Signing does not touch R2, so check the file is there before handing out a link to it.
      await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
      return getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
          ResponseContentType: 'application/pdf',
          ResponseContentDisposition: `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
        }),
        { expiresIn: LINK_SECONDS },
      )
    })
  },
  delete(key) {
    return call(async () => {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    })
  },
  ping() {
    return call(async () => {
      await client.send(new HeadBucketCommand({ Bucket: bucket }))
    })
  },
}

import { z } from 'zod'

export const credentialsSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export type Credentials = z.infer<typeof credentialsSchema>

export const signupSchema = credentialsSchema.extend({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(80, 'Name must be at most 80 characters.'),
})

export type Signup = z.infer<typeof signupSchema>

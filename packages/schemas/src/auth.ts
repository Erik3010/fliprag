import { z } from 'zod'

export const credentialsSchema = z.object({
  email: z.email('Enter an email address, like user@example.com'),
  password: z.string().min(8, 'Passwords are at least 8 characters'),
})

export type Credentials = z.infer<typeof credentialsSchema>

export const signupSchema = credentialsSchema.extend({
  name: z.string().trim().min(1, 'Enter your name').max(80, 'Names are at most 80 characters'),
})

export type Signup = z.infer<typeof signupSchema>

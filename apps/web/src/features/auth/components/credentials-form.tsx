import { type Credentials, credentialsSchema } from '@fliprag/schemas/auth'
import { Button } from '@fliprag/ui/components/button'
import { FieldError } from '@fliprag/ui/components/field-error'
import { Input } from '@fliprag/ui/components/input'
import { Label } from '@fliprag/ui/components/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

type CredentialsFormProps = {
  submitLabel: string
  onSubmit: (credentials: Credentials) => void
  pending?: boolean
  error?: string
}

export function CredentialsForm({ submitLabel, onSubmit, pending, error }: CredentialsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({ resolver: zodResolver(credentialsSchema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>

      <FieldError message={error} />

      <Button type="submit" disabled={pending} className="min-h-11 w-full">
        {submitLabel}
      </Button>
    </form>
  )
}

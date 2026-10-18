import { type Signup, signupSchema } from '@fliprag/schemas/auth'
import { Button } from '@fliprag/ui/components/button'
import { FieldError } from '@fliprag/ui/components/field-error'
import { Input } from '@fliprag/ui/components/input'
import { Label } from '@fliprag/ui/components/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

type SignupFormProps = {
  onSubmit: (details: Signup) => void
  pending?: boolean
  error?: string
}

export function SignupForm({ onSubmit, pending, error }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signup>({ resolver: zodResolver(signupSchema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter your name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        <FieldError id="name-error" message={errors.name?.message} />
      </div>

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
          autoComplete="new-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>

      <FieldError message={error} />

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        Create account
      </Button>
    </form>
  )
}

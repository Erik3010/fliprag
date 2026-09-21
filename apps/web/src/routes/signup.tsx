import { Card, CardContent, CardHeader } from '@fliprag/ui/components/card'
import { PageHeading } from '@fliprag/ui/components/page-heading'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CredentialsForm } from '@/features/auth/components/credentials-form'
import { useSignup } from '@/features/auth/hooks/use-signup'

export const Route = createFileRoute('/signup')({
  component: Signup,
})

function Signup() {
  const { submit, pending, error } = useSignup()

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center font-serif text-3xl tracking-tight">fliprag</p>

        <Card>
          <CardHeader>
            <PageHeading
              title="Create your account"
              description="Email and password is all it takes."
            />
          </CardHeader>
          <CardContent>
            <CredentialsForm
              submitLabel="Create account"
              onSubmit={submit}
              pending={pending}
              error={error}
            />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

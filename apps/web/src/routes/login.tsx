import { Card, CardContent, CardHeader } from '@fliprag/ui/components/card'
import { PageHeading } from '@fliprag/ui/components/page-heading'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CredentialsForm } from '@/features/auth/components/credentials-form'
import { useLogin } from '@/features/auth/hooks/use-login'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const { submit, pending, error } = useLogin()

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center font-serif text-3xl tracking-tight">fliprag</p>

        <Card>
          <CardHeader>
            <PageHeading
              title="Sign in"
              description="Use the email and password you signed up with."
            />
          </CardHeader>
          <CardContent>
            <CredentialsForm
              submitLabel="Sign in"
              onSubmit={submit}
              pending={pending}
              error={error}
            />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-muted-foreground text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}

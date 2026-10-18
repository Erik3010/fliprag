import { Card, CardContent, CardHeader } from '@fliprag/ui/components/card'
import { PageHeading } from '@fliprag/ui/components/page-heading'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SignupForm } from '@/features/auth/components/signup-form'
import { useSignup } from '@/features/auth/hooks/use-signup'

export const Route = createFileRoute('/_auth/signup')({
  head: () => ({ meta: [{ title: 'Create account' }] }),
  component: Signup,
})

function Signup() {
  const { submit, pending, error } = useSignup()

  return (
    <>
      <Card>
        <CardHeader>
          <PageHeading
            title="Create your account"
            description="Email and password is all it takes."
          />
        </CardHeader>
        <CardContent>
          <SignupForm onSubmit={submit} pending={pending} error={error} />
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-muted-foreground text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </>
  )
}

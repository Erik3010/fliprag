import { PageHeading } from '@fliprag/ui/components/page-heading'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/documents')({
  component: Documents,
})

function Documents() {
  return (
    <>
      <PageHeading title="Documents" description="Everything you have added to fliprag." />

      <div className="mt-8 rounded-lg border border-dashed px-6 py-12 text-center">
        <p className="font-medium">No documents yet</p>
        <p className="mt-1 text-pretty text-muted-foreground text-sm">
          Uploading is not built yet, so nothing can be added from here.
        </p>
      </div>
    </>
  )
}

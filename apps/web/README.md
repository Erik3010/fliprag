# Web app structure

How `apps/web/src` is organised, and where a new file goes.

```
src/
  features/
    auth/
      api.ts                            one function per endpoint
      components/credentials-form.tsx   feature-specific UI
      hooks/use-login.ts                what routes call
      hooks/use-signup.ts
    health/
      api.ts
      hooks/use-server-health.ts
  shared/
    api.ts                    configured ky instance, error formatting
  routes/                     owned by the router plugin, see below
    __root.tsx
    index.tsx  login.tsx  signup.tsx
  main.tsx                    app entry, providers
  styles.css                  imports the theme from @fliprag/ui
  routeTree.gen.ts            generated, never edited
```

## Where a new file goes

| What you are adding | Where |
| --- | --- |
| A page at a new URL | `routes/`, named for the path |
| Anything belonging to one feature | `features/<feature>/` |
| Something two features both need | `shared/` |
| A component another app could use | `packages/ui/src/components/` |
| A validation schema the server also uses | `packages/schemas/src/` |

The last two leave this app on purpose. A component with no app-specific knowledge belongs in
`@fliprag/ui` so a second app can render it. A schema the API validates belongs in
`@fliprag/schemas` so one definition serves the browser and the server, and changing a field
breaks compilation on both sides.

## Inside a feature

Every feature uses the same three folders, so there is never a question of where something goes.

| Path | Holds | Named |
| --- | --- | --- |
| `api.ts` | every call this feature makes to the server | one function per endpoint |
| `components/` | UI only this feature uses | after what it renders: `credentials-form.tsx` |
| `hooks/` | the feature's interface to routes | `use-*.ts` |

`api.ts` is one file by convention, not because a feature only has one endpoint today. Keep the
feature's server calls together there and let it grow; it does not become a folder. Components and
hooks are plural by nature, so they are folders from the start.

A folder may be missing when a feature has nothing of that kind. Do not create it empty.

**Hooks are the seam.** A route calls `useLogin()` and gets back what it needs to render:

```ts
const { submit, pending, error } = useLogin()
```

The hook owns the mutation, the pending flag, and turning a thrown ky error into a sentence.
That is why routes do not import `failureMessage`, `useMutation`, or the client directly: how a
request fails is the feature's business, not the page's. Anything a route learns about transport
is a leak that will be repeated in the next route.

Files that belong to the feature but fit none of the three folders sit at its root, named for
their subject: `tokens.ts`, `permissions.ts`.

## Rules worth keeping

**`routes/` belongs to the router.** The TanStack plugin generates `routeTree.gen.ts` from that
directory, so the filenames are the URLs and nothing else may live there. Treat a route as the
thin piece that wires a feature to a URL: read the params, call the feature, render. Logic that
would survive a URL change belongs in `features/`.

To colocate a component with the route that uses it, prefix the folder with `-`
(`routes/-parts/`). The plugin skips those, so they never become URLs.

**No barrel files.** Import the file you want: `@/features/auth/client`, not `@/features/auth`.
A barrel makes one import pull in the whole feature, which defeats the per-route code splitting
`autoCodeSplitting` gives us. The build currently emits a separate chunk per route; a barrel in
`features/auth` would merge them.

**Watch `shared/`.** It holds things more than one feature genuinely needs. When something lands
there that only one feature uses, it wanted to be in that feature. When two unrelated things sit
there, the second one probably wanted its own feature.

## Imports

| Alias | Points at |
| --- | --- |
| `@/…` | `apps/web/src`, declared in `tsconfig.json` and resolved by Vite via `tsconfigPaths` |
| `@fliprag/ui/components/…` | the shared component package |
| `@fliprag/schemas/…` | schemas shared with the server |

Both aliases are declared once in `apps/web/tsconfig.json`. Vite reads them from there, so there
is no second copy in `vite.config.ts` to keep in sync.

export function requireEnv<const Name extends string>(...names: Name[]): Record<Name, string> {
  const missing = names.filter((name) => !process.env[name])
  if (missing.length > 0) {
    throw new Error(`Missing in .env: ${missing.join(', ')}. See .env.example.`)
  }
  return Object.fromEntries(names.map((name) => [name, process.env[name]])) as Record<Name, string>
}

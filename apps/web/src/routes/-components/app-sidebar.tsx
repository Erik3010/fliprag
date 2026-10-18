import { Tooltip, TooltipContent, TooltipTrigger } from '@fliprag/ui/components/tooltip'
import { cn } from '@fliprag/ui/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'
import { FileText, House, UserRound } from 'lucide-react'

// Decks have no list of their own: they live on home, so /decks/* lights up Home.
const tabs = [
  { to: '/', label: 'Home', icon: House, sections: ['/decks'] },
  { to: '/documents', label: 'Documents', icon: FileText, sections: ['/documents'] },
] as const

const item =
  'grid size-11 place-items-center rounded-md text-sidebar-foreground/70 outline-offset-2 outline-sidebar-ring hover:bg-sidebar-border/60 hover:text-sidebar-accent-foreground focus-visible:outline-2'

const itemActive = 'bg-sidebar-border text-sidebar-accent-foreground'

function isIn(pathname: string, section: string) {
  return pathname === section || pathname.startsWith(`${section}/`)
}

export function AppSidebar() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const accountActive = isIn(pathname, '/account')

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 flex h-dvh w-14 shrink-0 flex-col justify-between border-sidebar-border border-r bg-sidebar py-3"
    >
      <ul className="flex flex-col items-center gap-1">
        {tabs.map(({ to, label, icon: Icon, sections }) => {
          const active = pathname === to || sections.some((section) => isIn(pathname, section))

          return (
            <li key={to}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={to}
                    activeOptions={{ exact: true }}
                    aria-current={active ? 'page' : undefined}
                    className={cn(item, active && itemActive)}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={6}>
                  {label}
                </TooltipContent>
              </Tooltip>
            </li>
          )
        })}
      </ul>

      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/account"
              aria-current={accountActive ? 'page' : undefined}
              className={cn(item, accountActive && itemActive)}
            >
              <UserRound className="size-5" aria-hidden="true" />
              <span className="sr-only">Account</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={6}>
            Account
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  )
}

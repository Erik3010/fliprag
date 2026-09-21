import { Tooltip, TooltipContent, TooltipTrigger } from '@fliprag/ui/components/tooltip'
import { Link } from '@tanstack/react-router'
import { FileText, House, LogIn } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Home', icon: House },
  { to: '/documents', label: 'Documents', icon: FileText },
] as const

const item =
  'grid size-11 place-items-center rounded-md text-sidebar-foreground/70 outline-offset-2 outline-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2'

const itemActive = 'bg-sidebar-accent text-sidebar-accent-foreground'

export function AppSidebar() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 flex h-dvh w-14 shrink-0 flex-col justify-between border-sidebar-border border-r bg-sidebar py-3"
    >
      <ul className="flex flex-col items-center gap-1">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={to}
                  activeOptions={{ exact: to === '/' }}
                  activeProps={{ className: itemActive }}
                  className={item}
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
        ))}
      </ul>

      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/login" className={item}>
              <LogIn className="size-5" aria-hidden="true" />
              <span className="sr-only">Sign in</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={6}>
            Sign in
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  )
}

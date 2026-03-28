import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Sprout, Bell, FileDown, LogOut, LayoutDashboard, Wheat, Coins, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export function AppLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/crops', label: 'Crops', icon: Wheat },
    { to: '/costs', label: 'Costs', icon: Coins },
    { to: '/predictions', label: 'AI prices', icon: Sparkles },
  ]

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-white">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-extrabold text-slate-900">
                Ikiguzi
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Crop cost & price tracker
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NavLink className="ik-btn-secondary px-3 py-2" to="/alerts">
              <Bell className="h-5 w-5" />
              <span className="hidden sm:inline">Alerts</span>
            </NavLink>
            <NavLink className="ik-btn-secondary px-3 py-2" to="/reports">
              <FileDown className="h-5 w-5" />
              <span className="hidden sm:inline">Reports</span>
            </NavLink>
            <button
              className="ik-btn-secondary px-3 py-2"
              type="button"
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-2">
          {links.map((l) => {
            const Icon = l.icon
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  [
                    'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold',
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-5xl px-4 py-5">
        <Outlet />
      </main>
    </div>
  )
}


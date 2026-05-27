import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

// ── Theme helpers ─────────────────────────────────────────────────────────────
// Read the initial theme from localStorage, falling back to the OS preference.
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme')
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}

// ── Sun icon ──────────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 5a7 7 0 100 14A7 7 0 0012 5z" />
  </svg>
)

// ── Moon icon ─────────────────────────────────────────────────────────────────
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
  </svg>
)

// ── Hamburger icon ────────────────────────────────────────────────────────────
const HamburgerIcon = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {open
      ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    }
  </svg>
)

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isInstructor, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [theme, setTheme]       = useState(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)

  // Apply theme class to <html> whenever theme state changes
  useEffect(() => { applyTheme(theme) }, [theme])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Build the nav links based on the user's role
  const navLinks = [
    { to: '/',         label: 'Courses',   always: true },
    { to: '/dashboard', label: 'My Learning', auth: true },
    { to: '/instructor/dashboard', label: 'Teach',  roles: ['instructor', 'admin'] },
    { to: '/admin/dashboard',      label: 'Admin',  roles: ['admin'] },
  ].filter(link => {
    if (link.always) return true
    if (link.auth   && !isAuthenticated) return false
    if (link.roles  && !link.roles.includes(user?.role)) return false
    return true
  })

  const isActive = (to) => location.pathname === to

  const linkClass = (to) =>
    `text-sm font-medium tracking-wide transition-colors duration-200 pb-0.5 border-b-2 ${
      isActive(to)
        ? 'text-teal-700 dark:text-teal-300 border-teal-600 dark:border-teal-400'
        : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-teal-700 dark:hover:text-teal-300 hover:border-teal-400'
    }`

  return (
    <header className="sticky top-0 z-50 bg-amber-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-amber-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          {/* Simple geometric mark — a book-ish square */}
          <span className="w-8 h-8 rounded-lg bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white font-display font-bold text-sm select-none">
            EB
          </span>
          <span className="font-display font-semibold text-lg text-slate-800 dark:text-amber-50 leading-none">
            EduBridge
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={linkClass(link.to)}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Right-side controls ── */}
        <div className="flex items-center gap-3">

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-amber-100 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-200"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Auth buttons — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User pill */}
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-1.5 rounded-lg border border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-slate-900 transition-colors duration-200 font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm px-4 py-1.5 rounded-lg bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors duration-200 font-medium shadow-sm"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Open menu"
            className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-amber-50 dark:bg-slate-900 border-t border-amber-200 dark:border-slate-700 px-4 py-4 flex flex-col gap-4 animate-fade-in">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={linkClass(link.to)}>
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-amber-200 dark:border-slate-700 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Signed in as <strong className="text-slate-700 dark:text-slate-200">{user?.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm w-full py-2 rounded-lg border border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300 hover:bg-teal-600 hover:text-white transition-colors font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="text-sm text-center py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-teal-500 transition-colors">Sign in</Link>
                <Link to="/register" className="text-sm text-center py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
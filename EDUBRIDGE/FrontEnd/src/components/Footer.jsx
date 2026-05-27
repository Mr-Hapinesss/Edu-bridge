import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-amber-50 dark:bg-slate-900 border-t border-amber-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <p className="font-display font-semibold text-lg text-slate-800 dark:text-amber-50 mb-2">
            EduBridge
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            A learning platform built for curious students and dedicated instructors.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
            Explore
          </p>
          <ul className="space-y-2">
            {[
              { to: '/',         label: 'All Courses' },
              { to: '/login',    label: 'Sign In' },
              { to: '/register', label: 'Create Account' },
            ].map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal / meta */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
            Info
          </p>
          <ul className="space-y-2">
            <li className="text-sm text-slate-500 dark:text-slate-400">Privacy Policy</li>
            <li className="text-sm text-slate-500 dark:text-slate-400">Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-amber-200 dark:border-slate-700 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        © {year} EduBridge. All rights reserved.
      </div>
    </footer>
  )
}
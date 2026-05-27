import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllUsers } from '../../api/usersApi'
import { getAllCourses } from '../../api/coursesApi'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [usersData, coursesData] = await Promise.all([getAllUsers(), getAllCourses()])
        const users   = usersData?.users   || usersData   || []
        const courses = coursesData?.courses || coursesData || []
        setStats({
          totalUsers:       users.length,
          students:         users.filter(u => u.role === 'student').length,
          instructors:      users.filter(u => u.role === 'instructor').length,
          admins:           users.filter(u => u.role === 'admin').length,
          totalCourses:     courses.length,
          publishedCourses: courses.filter(c => c.courseStatus === 'published').length,
        })
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Users',       value: stats?.totalUsers,       color: 'text-teal-700 dark:text-teal-400' },
    { label: 'Students',          value: stats?.students,         color: 'text-teal-700 dark:text-teal-400' },
    { label: 'Instructors',       value: stats?.instructors,      color: 'text-amber-700 dark:text-amber-400' },
    { label: 'Published Courses', value: stats?.publishedCourses, color: 'text-teal-700 dark:text-teal-400' },
  ]

  const quickLinks = [
    { to: '/admin/users',        label: 'Manage Users',   desc: 'View, search, and delete user accounts' },
    { to: '/admin/approve-role', label: 'Approve Roles',  desc: 'Promote users to instructor or admin' },
    { to: '/',                   label: 'View Catalogue', desc: 'Browse all published courses' },
  ]

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-sm">
          Platform overview and management tools.
        </p>

        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {cards.map(card => (
                <div key={card.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 px-5 py-5">
                  <p className={`font-display font-bold text-3xl ${card.color}`}>{card.value ?? '—'}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <h2 className="font-display font-semibold text-xl text-slate-800 dark:text-amber-50 mb-4">
              Quick actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 p-5 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-slate-800 dark:text-amber-50 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {link.label}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{link.desc}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
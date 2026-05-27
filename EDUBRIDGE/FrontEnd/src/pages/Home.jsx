import { Link } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import useAuth from '../hooks/useAuth'

// Decorative geometric shapes for the hero — pure CSS, no images needed
const HeroDecoration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-teal-100 dark:bg-teal-900/30 blur-3xl opacity-60" />
    <div className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-amber-200 dark:bg-amber-900/20 blur-3xl opacity-50" />
  </div>
)

export default function Home() {
  const { courses, loading, error } = useCourses()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <HeroDecoration />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">

          {/* Eyebrow label */}
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700 px-3 py-1 rounded-full mb-6">
            Welcome to EduBridge
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-amber-50 leading-tight max-w-3xl mx-auto">
            Knowledge worth{' '}
            <em className="not-italic text-teal-600 dark:text-teal-400">pursuing.</em>
          </h1>

          <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Explore courses taught by expert instructors. Learn at your own pace, track your progress, and grow your skills.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#courses"
              className="px-6 py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors shadow-md shadow-teal-200 dark:shadow-none"
            >
              Browse courses
            </a>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl border-2 border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
              >
                Create free account
              </Link>
            )}
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: courses.length || '—', label: 'Courses' },
              { value: 'Open',                label: 'Enrollment' },
              { value: '100%',                label: 'Free to join' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-display font-bold text-2xl text-teal-700 dark:text-teal-400">{stat.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course Grid ──────────────────────────────────────────────────── */}
      <section id="courses" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50">
              Published Courses
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              All courses below are open for enrollment.
            </p>
          </div>
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {!loading && `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" label="Loading courses…" />
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-2xl">
            <p className="font-semibold">Could not load courses.</p>
            <p className="text-sm mt-1 opacity-70">{error}</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <p className="font-display text-4xl mb-3">📚</p>
            <p className="font-semibold text-lg">No courses available yet.</p>
            <p className="text-sm mt-1">Check back soon — instructors are building something great.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
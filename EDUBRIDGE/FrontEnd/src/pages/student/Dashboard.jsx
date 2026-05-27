import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useEnrollments from '../../hooks/useEnrollment'
import CourseCard from '../../components/CourseCard'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function StudentDashboard() {
  const { user }                         = useAuth()
  const { enrollments, loading, error, unenroll } = useEnrollments()

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) return
    try {
      await unenroll(courseId)
    } catch {
      alert('Could not unenroll. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50">
            My Learning
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-medium text-teal-700 dark:text-teal-400">{user?.name}</span>.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Enrolled courses',  value: enrollments.length },
            { label: 'In progress',       value: enrollments.filter(e => e.status === 'in-progress').length },
            { label: 'Completed',         value: enrollments.filter(e => e.status === 'completed').length },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 px-5 py-4">
              <p className="font-display font-bold text-2xl text-teal-700 dark:text-teal-400">{stat.value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Course list */}
        <h2 className="font-display font-semibold text-xl text-slate-800 dark:text-amber-50 mb-5">
          Enrolled Courses
        </h2>

        {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}

        {error && (
          <div className="text-center py-12 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-2xl">
            {error}
          </div>
        )}

        {!loading && !error && enrollments.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700">
            <p className="font-display text-4xl mb-3">📖</p>
            <p className="font-semibold text-slate-600 dark:text-slate-300 text-lg">No courses yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-5">Start learning by exploring our course catalogue.</p>
            <Link to="/" className="px-5 py-2.5 rounded-xl bg-teal-600 dark:bg-teal-500 text-white text-sm font-semibold hover:bg-teal-700 transition-colors">
              Browse courses
            </Link>
          </div>
        )}

        {!loading && !error && enrollments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(enrollment => (
              enrollment.course && (
                <CourseCard
                  key={enrollment._id}
                  course={enrollment.course}
                  onUnenroll={() => handleUnenroll(enrollment.course._id)}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCourses, deleteCourse } from '../../api/coursesApi'
import useAuth from '../../hooks/useAuth'
import CourseCard from '../../components/CourseCard'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      // Instructors see all published courses; we filter to their own below
      const data = await getAllCourses()
      // Filter to only courses the logged-in instructor owns
      const mine = (data.courses || []).filter(
        c => c.instructor?._id === user?._id || c.instructor === user?._id
      )
      setCourses(mine)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return
    try {
      await deleteCourse(id)
      setCourses(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50">
              My Courses
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Manage and monitor everything you teach.
            </p>
          </div>
          <Link
            to="/instructor/courses/new"
            className="px-5 py-2.5 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold text-sm hover:bg-teal-700 transition-colors shadow-md shadow-teal-100 dark:shadow-none"
          >
            + New course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total',       value: courses.length },
            { label: 'Published',   value: courses.filter(c => c.courseStatus === 'published').length },
            { label: 'Draft',       value: courses.filter(c => c.courseStatus === 'draft').length },
            { label: 'In review',   value: courses.filter(c => c.courseStatus === 'under_review').length },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 px-5 py-4">
              <p className="font-display font-bold text-2xl text-teal-700 dark:text-teal-400">{s.value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}
        {error   && <div className="text-center py-10 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-2xl">{error}</div>}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700">
            <p className="font-display text-4xl mb-3">🎓</p>
            <p className="font-semibold text-slate-600 dark:text-slate-300 text-lg">No courses yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-5">Create your first course to get started.</p>
            <Link to="/instructor/courses/new" className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors">
              Create a course
            </Link>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="flex flex-col gap-2">
                <CourseCard course={course} showStatus />
                <div className="flex gap-2 px-1">
                  <Link
                    to={`/instructor/courses/${course._id}/edit`}
                    className="flex-1 text-center text-xs py-2 rounded-lg border border-teal-500 dark:border-teal-400 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 font-medium transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 text-xs py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
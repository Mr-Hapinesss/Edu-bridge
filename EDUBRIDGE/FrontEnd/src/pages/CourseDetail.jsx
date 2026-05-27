import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCourse } from '../hooks/useCourses'
import useAuth from '../hooks/useAuth'
import useEnrollments from '../hooks/useEnrollment'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/formatDate'

export default function CourseDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { course, loading, error } = useCourse(id)
  const { isAuthenticated, user }  = useAuth()
  const { enrollments, enroll }    = useEnrollments()

  const [enrolling, setEnrolling]   = useState(false)
  const [enrollMsg, setEnrollMsg]   = useState(null)
  const [enrollErr, setEnrollErr]   = useState(null)

  // Check if the logged-in user is already enrolled
  const alreadyEnrolled = enrollments.some(
    e => e.course?._id === id || e.course === id
  )

  const handleEnroll = async () => {
    if (!isAuthenticated) return navigate('/login', { state: { from: { pathname: `/courses/${id}` } } })
    try {
      setEnrolling(true)
      setEnrollErr(null)
      await enroll(id)
      setEnrollMsg('You are now enrolled! Find this course in your dashboard.')
    } catch (err) {
      setEnrollErr(err.response?.data?.message || 'Enrollment failed.')
    } finally {
      setEnrolling(false)
    }
  }

  const statusColors = {
    published:    'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    draft:        'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    archived:     'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  }

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>

  if (error || !course) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="font-display text-5xl text-teal-600 dark:text-teal-400 mb-3">Oops</p>
      <p className="text-slate-500 dark:text-slate-400">{error || 'Course not found.'}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900">

      {/* ── Top banner ── */}
      <div className="bg-white dark:bg-slate-800 border-b border-amber-100 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[course.courseStatus] || ''}`}>
              {course.courseStatus?.replace('_', ' ')}
            </span>
            {course.duration && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                {course.duration}
              </span>
            )}
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-amber-50 leading-tight max-w-2xl">
            {course.title}
          </h1>

          <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            {course.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Instructor: <strong className="text-slate-700 dark:text-slate-200">{course.instructor?.name}</strong></span>
            <span>Added: <strong className="text-slate-700 dark:text-slate-200">{formatDate(course.createdAt)}</strong></span>
            <span>Price: <strong className="text-teal-700 dark:text-teal-400">{course.price === 0 ? 'Free' : `$${course.price}`}</strong></span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left / main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 p-6">
            <h2 className="font-display font-semibold text-xl text-slate-800 dark:text-amber-50 mb-3">About this course</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {course.description || 'No additional details provided.'}
            </p>
          </div>
        </div>

        {/* Right / enroll sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 p-6 shadow-sm">

            <p className="font-display font-bold text-3xl text-teal-700 dark:text-teal-400 mb-5">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </p>

            {enrollMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 text-sm">
                {enrollMsg}
              </div>
            )}

            {enrollErr && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
                {enrollErr}
              </div>
            )}

            {alreadyEnrolled ? (
              <div className="w-full text-center py-3 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 font-semibold text-sm">
                ✓ Already enrolled
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling || course.courseStatus !== 'published'}
                className="w-full py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-teal-100 dark:shadow-none"
              >
                {enrolling ? 'Enrolling…' : isAuthenticated ? 'Enroll now' : 'Sign in to enroll'}
              </button>
            )}

            {course.courseStatus !== 'published' && (
              <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">
                This course is not open for enrollment yet.
              </p>
            )}

            <ul className="mt-6 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-teal-500">✓</span> Self-paced learning
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-500">✓</span> Access on any device
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-500">✓</span> Track your progress
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
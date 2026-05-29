import { Link } from 'react-router-dom'

/*
 CourseCard
 Props:
   course: { _id, title, description, price, duration, instructor: { name }, courseStatus }
   onEnroll?:   (courseId) => void   — show Enroll button if provided
   onUnenroll?: (courseId) => void   — show Unenroll button if provided
   showStatus?: boolean              — show the status badge (for instructor dashboard)
 */
export default function CourseCard({ course, onEnroll, onUnenroll, showStatus = false }) {
  const { _id, title, description, price, duration, instructor, courseStatus } = course

  const statusColors = {
    published:    'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    draft:        'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    archived:     'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  }

  return (
    <article className="group bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">

      {/* Coloured top band — gives each card a bit of visual identity */}
      <div className="h-1.5 bg-gradient-to-r from-teal-500 to-teal-400 dark:from-teal-600 dark:to-teal-500" />

      <div className="p-5 flex flex-col flex-grow gap-3">

        {/* Status badge (instructor view) */}
        {showStatus && courseStatus && (
          <span className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[courseStatus] || statusColors.draft}`}>
            {courseStatus.replace('_', ' ')}
          </span>
        )}

        {/* Title */}
        <h3 className="font-display font-semibold text-slate-800 dark:text-amber-50 text-lg leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 flex-grow">
          {description || 'No description provided.'}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1">
          <span>By {instructor?.name || 'Unknown'}</span>
          {duration && <span>{duration}</span>}
        </div>

        {/* Price + actions */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-100 dark:border-slate-700 mt-auto">
          <span className="font-display font-bold text-teal-700 dark:text-teal-400 text-base">
            {price === 0 ? 'Free' : `$${price}`}
          </span>

          <div className="flex gap-2">
            <Link
              to={`/courses/${_id}`}
              className="text-xs px-3 py-1.5 rounded-lg border border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors font-medium"
            >
              View
            </Link>

            {onEnroll && (
              <button
                onClick={() => onEnroll(_id)}
                className="text-xs px-3 py-1.5 rounded-lg bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors font-medium"
              >
                Enroll
              </button>
            )}

            {onUnenroll && (
              <button
                onClick={() => onUnenroll(_id)}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors font-medium"
              >
                Unenroll
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
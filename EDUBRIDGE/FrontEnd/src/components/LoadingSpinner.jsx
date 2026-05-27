/**
 * LoadingSpinner
 * A simple, accessible animated spinner using the brand teal colour.
 * Props:
 *   size?:    'sm' | 'md' | 'lg'   default 'md'
 *   label?:   string               screen-reader label
 */
export default function LoadingSpinner({ size = 'md', label = 'Loading…' }) {
  const sizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-[3px]',
    lg: 'w-14 h-14 border-4',
  }[size] || 'w-9 h-9 border-[3px]'

  return (
    <div role="status" aria-label={label} className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClass} rounded-full border-teal-200 dark:border-slate-700 border-t-teal-600 dark:border-t-teal-400 animate-spin`}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
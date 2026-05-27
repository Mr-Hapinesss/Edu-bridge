/**
 * formatDate(dateString)
 * Converts an ISO date string to a readable format.
 * e.g. "2024-03-15T10:30:00.000Z" → "March 15, 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

/**
 * formatDateShort(dateString)
 * e.g. "2024-03-15T10:30:00.000Z" → "Mar 15, 2024"
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  })
}

/**
 * timeAgo(dateString)
 * Returns a relative time string.
 * e.g. "3 days ago", "just now", "2 months ago"
 */
export const timeAgo = (dateString) => {
  if (!dateString) return ''
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000)
  const intervals = [
    { label: 'year',   seconds: 31536000 },
    { label: 'month',  seconds: 2592000  },
    { label: 'week',   seconds: 604800   },
    { label: 'day',    seconds: 86400    },
    { label: 'hour',   seconds: 3600     },
    { label: 'minute', seconds: 60       },
  ]
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
  }
  return 'just now'
}
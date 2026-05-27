import { useState, useEffect, useCallback } from 'react'
import { getMyEnrollments, enrollInCourse, unenrollFromCourse } from '../api/enrollment'

/**
 * useEnrollments
 * Manages the logged-in user's enrollments.
 * Exposes enroll() and unenroll() actions that optimistically refresh the list.
 *
 * Usage:
 *   const { enrollments, loading, error, enroll, unenroll } = useEnrollments()
 */
export default function useEnrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMyEnrollments()
      setEnrollments(data.enrollments || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load enrollments.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  // Enroll in a course, then refresh the list
  const enroll = useCallback(async (courseId) => {
    await enrollInCourse(courseId)
    await fetchEnrollments()
  }, [fetchEnrollments])

  // Unenroll from a course, then refresh the list
  const unenroll = useCallback(async (courseId) => {
    await unenrollFromCourse(courseId)
    await fetchEnrollments()
  }, [fetchEnrollments])

  return { enrollments, loading, error, enroll, unenroll, refetch: fetchEnrollments }
}
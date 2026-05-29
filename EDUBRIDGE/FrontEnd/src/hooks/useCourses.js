import { useState, useEffect } from 'react'
import { getAllCourses, getCourseById } from '../api/coursesApi'

/*
 useCourses
 Fetches the published course list on mount.
 Returns loading, error, and courses array.

 Usage:
   const { courses, loading, error } = useCourses()
 */
export function useCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false // prevents state update on unmounted component

    const fetch = async () => {
      try {
        setLoading(true)
        const data = await getAllCourses()
        if (!cancelled) setCourses(data.courses || [])
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load courses.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [])

  return { courses, loading, error }
}

/*
 useCourse
 Fetches a single course by ID.

 Usage:
   const { course, loading, error } = useCourse(id)
 */
export function useCourse(id) {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetch = async () => {
      try {
        setLoading(true)
        const data = await getCourseById(id)
        if (!cancelled) setCourse(data)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load course.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [id])

  return { course, loading, error }
}
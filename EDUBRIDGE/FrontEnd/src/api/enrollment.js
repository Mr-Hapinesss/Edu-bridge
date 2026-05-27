import axiosInstance from './axios'

// POST /api/enroll  — enroll logged-in user into a course
export const enrollInCourse = async (courseId) => {
  const { data } = await axiosInstance.post('/enroll', { courseId })
  return data // { message, enrollment }
}

// GET /api/enroll/my-courses  — get all courses the logged-in user enrolled in
export const getMyEnrollments = async () => {
  const { data } = await axiosInstance.get('/enroll/my-courses')
  return data // { count, enrollments[] }
}

// DELETE /api/enroll/:courseId  — unenroll from a course
export const unenrollFromCourse = async (courseId) => {
  const { data } = await axiosInstance.delete(`/enroll/${courseId}`)
  return data // { message }
}
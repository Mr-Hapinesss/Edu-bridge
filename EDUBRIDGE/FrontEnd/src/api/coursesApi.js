import axiosInstance from './axios'

// GET /api/courses  — public, returns published courses only
export const getAllCourses = async () => {
  const { data } = await axiosInstance.get('/courses')
  return data // { count, courses[] }
}

// GET /api/courses/:id  — public
export const getCourseById = async (id) => {
  const { data } = await axiosInstance.get(`/courses/${id}`)
  return data
}

// POST /api/courses  — instructor / admin only
export const createCourse = async (courseData) => {
  const { data } = await axiosInstance.post('/courses', courseData)
  return data
}

// PUT /api/courses/:id  — owner instructor or admin
export const updateCourse = async (id, courseData) => {
  const { data } = await axiosInstance.put(`/courses/${id}`, courseData)
  return data
}

// DELETE /api/courses/:id  — owner instructor or admin
export const deleteCourse = async (id) => {
  const { data } = await axiosInstance.delete(`/courses/${id}`)
  return data
}
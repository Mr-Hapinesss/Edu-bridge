import axiosInstance from './axios'

/*
Auth API
All functions return the `data` object from the Axios response directly,
so callers get clean objects without needing to unwrap `.data` themselves.
 */

// POST /api/users/register
export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post('/api/auth/users/register', userData)
  return data // { _id, name, email, role, token }
}

// POST /api/users/login
export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post('/api/auth/users/login', credentials)
  return data // { _id, name, email, role, token }
}

// GET /api/users/profile  — requires token (handled by interceptor)
export const getMyProfile = async () => {
  const { data } = await axiosInstance.get('/api/auth/users/profile')
  return data
}
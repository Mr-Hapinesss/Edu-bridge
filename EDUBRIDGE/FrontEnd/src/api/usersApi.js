import axiosInstance from './axios'

// GET /api/users/me  — get own profile
export const getMe = async () => {
  const { data } = await axiosInstance.get('/api/auth/users/me')
  return data
}

// PUT /api/users/me  — update own profile (name, email, password)
export const updateMe = async (updates) => {
  const { data } = await axiosInstance.put('/api/auth/users/me', updates)
  return data
}

// DELETE /api/users/me  — delete own account
export const deleteMe = async () => {
  const { data } = await axiosInstance.delete('/api/auth/users/me')
  return data
}

// GET /api/users/:id  — admin / instructor only
export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/api/auth/users/${id}`)
  return data
}

// GET /api/users  — admin / instructor only
export const getAllUsers = async () => {
  const { data } = await axiosInstance.get('/api/auth/users')
  return data
}

// PUT /api/users/approve-role/:id  — admin only
export const approveUserRole = async (id, newRole) => {
  const { data } = await axiosInstance.put(`/api/auth/users/approve-role/${id}`, { newRole })
  return data
}

// DELETE /api/users/:id  — admin / instructor only
export const deleteUserById = async (id) => {
  const { data } = await axiosInstance.delete(`/api/auth/users/${id}`)
  return data
}
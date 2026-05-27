import { createContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser } from '../api/authApi'

/**
 * AuthContext
 * Single source of truth for authentication state.
 * Persists user + token to localStorage so sessions survive page refreshes.
 * Any component can call useContext(AuthContext) to read or mutate auth state.
 */
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true) // true during initial hydration

  // ── Hydrate from localStorage on first mount ─────────────────────────────
  // This runs once. If a valid session exists, restore it before the first
  // render so ProtectedRoute doesn't flash the login page on refresh.
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser  = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false) // Hydration done — app can now render
  }, [])

  // ── Persist helpers ───────────────────────────────────────────────────────
  const persistSession = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearSession = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // ── Auth actions exposed to consumers ────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials)
    persistSession(
      { _id: data._id, name: data.name, email: data.email, role: data.role },
      data.token
    )
    return data // let the caller handle navigation
  }, [])

  const register = useCallback(async (userData) => {
    const data = await registerUser(userData)
    persistSession(
      { _id: data._id, name: data.name, email: data.email, role: data.role },
      data.token
    )
    return data
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [])

  // Convenience booleans used throughout the UI
  const isAuthenticated = !!token
  const isAdmin         = user?.role === 'admin'
  const isInstructor    = user?.role === 'instructor'

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated, isAdmin, isInstructor,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
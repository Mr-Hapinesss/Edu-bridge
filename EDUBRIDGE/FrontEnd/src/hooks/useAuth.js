import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * useAuth
 * Clean shorthand hook — import this instead of importing both
 * useContext and AuthContext everywhere.
 *
 * Usage:
 *   const { user, login, logout, isAdmin } = useAuth()
 */
export default function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>. Check that AuthProvider wraps your component tree in main.jsx.')
  }

  return context
}
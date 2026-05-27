import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

/**
 * ProtectedRoute
 * Wraps any route that requires the user to be logged in.
 * If loading (hydrating from localStorage), shows a spinner — this prevents
 * the login redirect flash on page refresh while auth state is being restored.
 * If not authenticated, redirects to /login and remembers where the user
 * was trying to go (via location state) so we can send them back after login.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Still hydrating — don't redirect yet
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Save the attempted URL so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Render the matched child route
  return <Outlet />
}
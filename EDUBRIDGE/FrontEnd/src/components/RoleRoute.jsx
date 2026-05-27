import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

/**
 * RoleRoute
 * Extends ProtectedRoute with role-based access control.
 * Props:
 *   allowedRoles: string[]  — e.g. ['admin', 'instructor']
 *
 * Behaviour:
 *   - Not logged in  → redirect to /login
 *   - Wrong role     → redirect to /dashboard (they're logged in, just not authorised)
 *   - Correct role   → render child routes via <Outlet />
 *
 * Usage in App.jsx:
 *   <Route element={<RoleRoute allowedRoles={['admin']} />}>
 *     <Route path="/admin/dashboard" element={<AdminDashboard />} />
 *   </Route>
 */
export default function RoleRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user?.role)) {
    // Authenticated but wrong role — send to their own dashboard, not login
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
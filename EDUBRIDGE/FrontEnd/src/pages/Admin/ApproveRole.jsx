import { useState, useEffect } from 'react'
import { getAllUsers, approveUserRole } from '../../api/usersApi'
import LoadingSpinner from '../../components/LoadingSpinner'

const PROMOTABLE_ROLES = ['instructor', 'admin']

export default function ApproveRole() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [processing, setProcessing] = useState(null) // userId being processed
  const [feedback, setFeedback]     = useState({})   // { [userId]: { type, msg } }

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllUsers()
        // Only show users that can be promoted (exclude existing admins if desired)
        setUsers(data?.users || data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleApprove = async (userId, newRole) => {
    setProcessing(userId)
    setFeedback(p => ({ ...p, [userId]: null }))
    try {
      await approveUserRole(userId, newRole)
      // Update the user's role in local state so the UI reflects it immediately
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u))
      setFeedback(p => ({ ...p, [userId]: { type: 'success', msg: `Role updated to ${newRole}.` } }))
    } catch (err) {
      setFeedback(p => ({ ...p, [userId]: { type: 'error', msg: err.response?.data?.message || 'Failed to update role.' } }))
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50 mb-2">
          Role Approvals
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          Promote users to Instructor or Admin. This action is logged and cannot be automatically reversed.
        </p>

        {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}
        {error   && <div className="text-center py-10 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-2xl">{error}</div>}

        {!loading && !error && (
          <div className="space-y-3">
            {users.map(u => (
              <div
                key={u._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-display font-bold text-lg shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{u.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{u.email}</p>
                  </div>
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full capitalize bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                    {u.role}
                  </span>
                </div>

                {/* Feedback + actions */}
                <div className="flex flex-col items-end gap-2">
                  {feedback[u._id] && (
                    <p className={`text-xs font-medium ${feedback[u._id].type === 'success' ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-red-400'}`}>
                      {feedback[u._id].msg}
                    </p>
                  )}
                  <div className="flex gap-2">
                    {PROMOTABLE_ROLES.filter(r => r !== u.role).map(role => (
                      <button
                        key={role}
                        onClick={() => handleApprove(u._id, role)}
                        disabled={processing === u._id}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 disabled:opacity-50 font-medium transition-colors capitalize"
                      >
                        {processing === u._id ? '…' : `Make ${role}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <p className="text-center py-12 text-slate-400 dark:text-slate-500">No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
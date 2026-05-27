import { useState, useEffect } from 'react'
import { getAllUsers, deleteUserById } from '../../api/usersApi'
import LoadingSpinner from '../../components/LoadingSpinner'
import { formatDateShort } from '../../utils/formatDate'

const ROLE_COLORS = {
  admin:      'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  instructor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  student:    'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
}

export default function UserList() {
  const [users, setUsers]     = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]   = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllUsers()
        const list = data?.users || data || []
        setUsers(list)
        setFiltered(list)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Apply search + role filter whenever either changes
  useEffect(() => {
    let result = users
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, roleFilter, users])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await deleteUserById(id)
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50 mb-2">
          User Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          {users.length} total users on the platform.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          >
            <option value="all">All roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}
        {error   && <div className="text-center py-10 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-2xl">{error}</div>}

        {!loading && !error && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 overflow-hidden">
            {filtered.length === 0 ? (
              <p className="text-center py-12 text-slate-400 dark:text-slate-500">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-amber-50 dark:bg-slate-700/50 border-b border-amber-100 dark:border-slate-700">
                    <tr>
                      {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-50 dark:divide-slate-700">
                    {filtered.map(u => (
                      <tr key={u._id} className="hover:bg-amber-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-100">{u.name}</td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[u.role] || ''}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">{formatDateShort(u.createdAt)}</td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleDelete(u._id, u.name)}
                            className="text-xs text-red-500 dark:text-red-400 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
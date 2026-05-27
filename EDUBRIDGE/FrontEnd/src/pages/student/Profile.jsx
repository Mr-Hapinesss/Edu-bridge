import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { updateMe } from '../../api/usersApi'

export default function StudentProfile() {
  const { user, logout } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  })
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError]     = useState(null)

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setSuccess(null)
    setError(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const updates = {}
    if (form.name  !== user.name)  updates.name  = form.name
    if (form.email !== user.email) updates.email = form.email
    if (form.password)             updates.password = form.password

    if (Object.keys(updates).length === 0) {
      return setError('No changes to save.')
    }

    try {
      setSaving(true)
      setError(null)
      await updateMe(updates)
      setSuccess('Profile updated successfully.')
      setForm(p => ({ ...p, password: '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-amber-200 dark:border-slate-600 bg-amber-50/50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50 mb-8">
          My Profile
        </h1>

        {/* Info card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-display font-bold text-2xl shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-amber-50">{user?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 p-6">
          <h2 className="font-display font-semibold text-lg text-slate-800 dark:text-amber-50 mb-5">
            Edit details
          </h2>

          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New password <span className="text-slate-400 font-normal">(leave blank to keep current)</span></label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass} />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
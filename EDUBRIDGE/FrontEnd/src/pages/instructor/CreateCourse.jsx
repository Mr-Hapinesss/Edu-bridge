import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createCourse } from '../../api/coursesApi'

const STATUSES = ['draft', 'under_review', 'published', 'archived']

export default function CreateCourse() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', price: '', duration: '', courseStatus: 'draft',
  })
  const [error, setError]     = useState(null)
  const [saving, setSaving]   = useState(false)

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) {
      return setError('Title and description are required.')
    }
    try {
      setSaving(true)
      await createCourse({ ...form, price: Number(form.price) || 0 })
      navigate('/instructor/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-amber-200 dark:border-slate-600 bg-amber-50/50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-6">
          <Link to="/instructor/dashboard" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            My Courses
          </Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">New Course</span>
        </div>

        <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50 mb-8">
          Create a new course
        </h1>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 p-6 sm:p-8">

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Course title <span className="text-red-400">*</span></label>
              <input name="title" type="text" value={form.title} onChange={handleChange} placeholder="e.g. Introduction to Algebra" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Description <span className="text-red-400">*</span></label>
              <textarea name="description" rows={4} value={form.description} onChange={handleChange} placeholder="What will students learn?" className={`${inputClass} resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (USD)</label>
                <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="0 for free" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <input name="duration" type="text" value={form.duration} onChange={handleChange} placeholder="e.g. 6 weeks" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Initial status</label>
              <select name="courseStatus" value={form.courseStatus} onChange={handleChange} className={inputClass}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                Set to <em>draft</em> while building, <em>under review</em> when ready to submit, <em>published</em> to open enrollment.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors"
              >
                {saving ? 'Creating…' : 'Create course'}
              </button>
              <Link
                to="/instructor/dashboard"
                className="flex-1 py-3 rounded-xl border border-amber-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold text-center hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
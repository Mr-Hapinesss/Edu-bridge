import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ROLES = [
  { value: 'student',    label: 'Student',    desc: 'I want to take courses' },
  { value: 'instructor', label: 'Instructor', desc: 'I want to teach courses' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    gradeLevel: '', department: '',
  })
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      return setError('Name, email, and password are required.')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }
    if (form.role === 'student' && !form.gradeLevel) {
      return setError('Grade level is required for students.')
    }
    if (form.role === 'instructor' && !form.department) {
      return setError('Department is required for instructors.')
    }

    try {
      setLoading(true)
      const payload = {
        name: form.name, email: form.email,
        password: form.password, role: form.role,
        ...(form.role === 'student'    && { gradeLevel: Number(form.gradeLevel) }),
        ...(form.role === 'instructor' && { department: form.department }),
      }
      await register(payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-amber-200 dark:border-slate-600 bg-amber-50/50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-amber-50 dark:bg-slate-900">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-amber-100 dark:shadow-slate-900/50 border border-amber-100 dark:border-slate-700 p-8 sm:p-10">

          <div className="mb-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 dark:bg-teal-500 text-white font-display font-bold text-xl mb-4">EB</span>
            <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50">Create your account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Join Edubridge — it's free</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                I am a…
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, role: r.value }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      form.role === r.value
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-400'
                        : 'border-amber-200 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-600'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${form.role === r.value ? 'text-teal-700 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300'}`}>
                      {r.label}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
              <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass} />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@school.edu" className={inputClass} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className={inputClass} />
            </div>

            {/* Conditional fields */}
            {form.role === 'student' && (
              <div>
                <label htmlFor="gradeLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Grade level</label>
                <input id="gradeLevel" name="gradeLevel" type="number" min="1" max="13" value={form.gradeLevel} onChange={handleChange} placeholder="e.g. 10" className={inputClass} />
              </div>
            )}

            {form.role === 'instructor' && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                <input id="department" name="department" type="text" value={form.department} onChange={handleChange} placeholder="e.g. Mathematics" className={inputClass} />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md shadow-teal-200 dark:shadow-none"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
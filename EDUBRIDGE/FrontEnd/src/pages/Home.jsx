import { Link } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import CourseCard from '../components/CourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import useAuth from '../hooks/useAuth'

// Decorative geometric shapes for the hero — pure CSS, no images needed
const HeroDecoration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-teal-100 dark:bg-teal-900/30 blur-3xl opacity-60" />
    <div className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-amber-200 dark:bg-amber-900/20 blur-3xl opacity-50" />
  </div>
)

// ── Reviews data ─────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    id: 1,
    name: 'Amara Osei',
    role: 'Grade 11 Student',
    avatar: 'A',
    text: 'LearnHub completely changed how I study. The courses are clear, well-paced, and I actually look forward to logging in every day.',
    stars: 5,
  },
  {
    id: 2,
    name: 'Mr. Daniel Kofi',
    role: 'Mathematics Instructor',
    avatar: 'D',
    text: 'Creating and managing my courses is incredibly straightforward. My students are more engaged than ever — the platform just works.',
    stars: 5,
  },
  {
    id: 3,
    name: 'Priya Nambiar',
    role: 'Grade 9 Student',
    avatar: 'P',
    text: 'I love that I can track exactly which courses I\'ve enrolled in. The interface is clean and nothing feels overwhelming.',
    stars: 5,
  },
  {
    id: 4,
    name: 'Ms. Fatima Al-Hassan',
    role: 'Biology Instructor',
    avatar: 'F',
    text: 'The status lifecycle for courses is genius. I draft everything first, review internally, then publish — it keeps everything organised.',
    stars: 5,
  },
  {
    id: 5,
    name: 'Theo Mensah',
    role: 'Grade 10 Student',
    avatar: 'T',
    text: 'I\'ve tried other learning platforms but LearnHub feels like it was actually built for students. Fast, simple, and the dark mode is 🔥.',
    stars: 5,
  },
  {
    id: 6,
    name: 'Sophia Andersen',
    role: 'Grade 12 Student',
    avatar: 'S',
    text: 'Being able to unenroll and switch courses without hassle is a huge deal. No admin emails, no waiting — just instant.',
    stars: 4,
  },
  {
    id: 7,
    name: 'Mr. James Okonkwo',
    role: 'History Instructor',
    avatar: 'J',
    text: 'The admin approval flow for course publishing gives me confidence that quality is maintained. Exactly what a school platform needs.',
    stars: 5,
  },
]

// Star renderer
const Stars = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < count ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
        fill="currentColor" viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

// Individual review card
const ReviewCard = ({ review }) => (
  <div className="w-72 shrink-0 mx-3 bg-white dark:bg-slate-800 rounded-2xl border border-amber-100/80 dark:border-slate-700/60 p-5 shadow-sm flex flex-col gap-3">
    <Stars count={review.stars} />
    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">
      "{review.text}"
    </p>
    <div className="flex items-center gap-3 pt-2 border-t border-amber-50 dark:border-slate-700/50">
      <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center text-teal-700 dark:text-teal-300 font-display font-bold text-base shrink-0">
        {review.avatar}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{review.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{review.role}</p>
      </div>
    </div>
  </div>
)

// The full reviews section — drop this in Home.jsx just before the closing </div>
const ReviewsSection = () => (
  // Very subtle tint — amber-100/60 on light, slate-800/40 on dark (barely perceptible)
  <section className="w-full py-16 overflow-hidden bg-amber-100/60 dark:bg-slate-800/40">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 text-center">
      <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700 px-3 py-1 rounded-full mb-4">
        Reviews
      </span>
      <h2 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50">
        What learners are saying
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-md mx-auto">
        Students and instructors from across the platform share their experience.
      </p>
    </div>

    {/* Marquee track — the inner div is duplicated so the loop is seamless */}
    <div className="relative flex overflow-hidden">
      {/* Fade edges — purely decorative, reinforces the scroll effect */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-amber-100/60 dark:from-slate-800/40 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-amber-100/60 dark:from-slate-800/40 to-transparent" />

      {/* The scrolling track — contains the list twice for a seamless loop */}
      <div className="animate-marquee flex">
        {/* First copy */}
        {REVIEWS.map(review => (
          <ReviewCard key={`a-${review.id}`} review={review} />
        ))}
        {/* Exact duplicate — when the first copy scrolls fully off-screen,
            this copy is already in position and the loop is invisible */}
        {REVIEWS.map(review => (
          <ReviewCard key={`b-${review.id}`} review={review} />
        ))}
      </div>
    </div>
  </section>
)

export default function Home() {
  const { courses, loading, error } = useCourses()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <HeroDecoration />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">

          {/* Eyebrow label */}
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700 px-3 py-1 rounded-full mb-6">
            Welcome to EduBridge
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-amber-50 leading-tight max-w-3xl mx-auto">
            Knowledge worth{' '}
            <em className="not-italic text-teal-600 dark:text-teal-400">pursuing.</em>
          </h1>

          <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Explore courses taught by expert instructors. Learn at your own pace, track your progress, and grow your skills.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#courses"
              className="px-6 py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors shadow-md shadow-teal-200 dark:shadow-none"
            >
              Browse courses
            </a>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl border-2 border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
              >
                Create free account
              </Link>
            )}
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: courses.length || '—', label: 'Courses' },
              { value: 'Open',                label: 'Enrollment' },
              { value: '100%',                label: 'Free to join' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-display font-bold text-2xl text-teal-700 dark:text-teal-400">{stat.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course Grid ──────────────────────────────────────────────────── */}
      <section id="courses" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-slate-800 dark:text-amber-50">
              Published Courses
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              All courses below are open for enrollment.
            </p>
          </div>
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {!loading && `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" label="Loading courses…" />
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-2xl">
            <p className="font-semibold">Could not load courses.</p>
            <p className="text-sm mt-1 opacity-70">{error}</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <p className="font-display text-4xl mb-3">📚</p>
            <p className="font-semibold text-lg">No courses available yet.</p>
            <p className="text-sm mt-1">Check back soon — instructors are building something great.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
      <ReviewsSection />
    </div>
  )
}
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'

// Public pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CourseDetail from './pages/CourseDetail'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import StudentProfile from './pages/student/Profile'

// Instructor pages
import InstructorDashboard from './pages/instructor/Dashboard'
import CreateCourse from './pages/instructor/CreateCourse'
import EditCourse from './pages/instructor/EditCourse'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import UserList from './pages/admin/UserList'
import ApproveRole from './pages/admin/ApproveRole'

export default function App() {
  return (
    // min-h-screen + flex column ensures the footer always sticks to the bottom
    <div className="min-h-screen flex flex-col bg-amber-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      {/* Main content grows to fill available space between navbar and footer */}
      <main className="flex-grow">
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* ── Student Routes (any authenticated user) ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"  element={<StudentDashboard />} />
            <Route path="/profile"    element={<StudentProfile />} />
          </Route>

          {/* ── Instructor Routes ── */}
          <Route element={<RoleRoute allowedRoles={['instructor', 'admin']} />}>
            <Route path="/instructor/dashboard"    element={<InstructorDashboard />} />
            <Route path="/instructor/courses/new"  element={<CreateCourse />} />
            <Route path="/instructor/courses/:id/edit" element={<EditCourse />} />
          </Route>

          {/* ── Admin Routes ── */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard"    element={<AdminDashboard />} />
            <Route path="/admin/users"        element={<UserList />} />
            <Route path="/admin/approve-role" element={<ApproveRole />} />
          </Route>

          {/* ── 404 Fallback ── */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <p className="font-display text-6xl font-bold text-teal-600 dark:text-teal-400">404</p>
                <p className="mt-2 text-lg">Page not found.</p>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
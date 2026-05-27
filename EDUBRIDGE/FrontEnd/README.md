# EDUBRIDGE — Full-Stack Learning Management System

A full-stack LMS built with **Node.js / Express / MongoDB** on the backend and **React / Vite / Tailwind CSS** on the frontend. Supports three user roles (Student, Instructor, Admin) with JWT authentication, role-based access control, and course enrollment management.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [API Reference](#api-reference)
7. [Role System](#role-system)
8. [Frontend Overview](#frontend-overview)
9. [Design System](#design-system)
10. [Known Limitations & Roadmap](#known-limitations--roadmap)

---

## Features

**Authentication**
- Register and login with JWT (stored in localStorage, auto-attached to all requests)
- Persistent sessions across page refreshes
- Automatic redirect to login on token expiry (401 interceptor)

**Students**
- Browse all published courses
- Enroll in / unenroll from any published course
- Track enrollment status (enrolled → in-progress → completed)
- View and edit personal profile

**Instructors**
- Create, edit, and delete their own courses
- Manage course status lifecycle: `draft → under_review → published → archived`
- View their own course dashboard with status filters

**Admins**
- View all users with search and role filtering
- Delete any user account (with hierarchy enforcement)
- Promote users to Instructor or Admin
- Platform-wide stats dashboard

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, React Router v6         |
| Styling    | Tailwind CSS v3 (dark mode via `class`) |
| HTTP       | Axios (with request/response interceptors) |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB with Mongoose ODM               |
| Auth       | JSON Web Tokens (jsonwebtoken), bcryptjs |
| Dev tools  | nodemon, dotenv                         |

---

## Project Structure
├── backend/
│   ├── server.js                  # Express app entry point
│   ├── config/
│   │   └── db.js                  # Mongoose connection
│   ├── models/
│   │   ├── userSchema.js
│   │   ├── courseSchema.js
│   │   └── enrollmentSchema.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── courseRoutes.js
│   │   └── enrollmentRoutes.js
│   ├── controllers/
│   │   └── userController.js      # getAllUsers handler
│   ├── middleware/
│   │   ├── authMiddleware.js       # protect, authorizeRoles
│   │   ├── roleMiddleware.js       # authorize
│   │   └── errorMiddleware.js      # notFound, errorHandler
│   └── utils/
│       └── generateToken.js
│
├── frontend/
│   ├── index.html
│   ├── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   ├── axiosInstance.js
│       │   ├── authApi.js
│       │   ├── coursesApi.js
│       │   ├── enrollmentApi.js
│       │   └── usersApi.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useCourses.js
│       │   └── useEnrollments.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── CourseCard.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── RoleRoute.jsx
│       │   └── LoadingSpinner.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── CourseDetail.jsx
│       │   ├── student/
│       │   │   ├── Dashboard.jsx
│       │   │   └── Profile.jsx
│       │   ├── instructor/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── CreateCourse.jsx
│       │   │   └── EditCourse.jsx
│       │   └── admin/
│       │       ├── Dashboard.jsx
│       │       ├── UserList.jsx
│       │       └── ApproveRole.jsx
│       └── utils/
│           └── formatDate.js
│
├── .env                           # Never commit this
├── .env.example
├── .gitignore
└── README.md

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas URI)

### Backend

```bash
cd backend
npm install
# copy .env.example to .env and fill in values
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env        # set VITE_API_URL
npm run dev
```

Both servers run concurrently. The frontend proxies API calls to the backend via `VITE_API_URL`.

---

## Environment Variables

### Backend `.env`

PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/learnhub
JWT_SECRET=your_long_random_secret_here
NODE_ENV=development

### Frontend `.env`
VITE_API_URL=your_backend_url_here

---

## API Reference

### Auth / Users — `/api/users`

| Method | Endpoint                   | Access              | Description                    |
|--------|----------------------------|---------------------|--------------------------------|
| POST   | `/register`                | Public              | Create account                 |
| POST   | `/login`                   | Public              | Login and receive JWT          |
| GET    | `/me`                      | Private             | Get own profile                |
| PUT    | `/me`                      | Private             | Update own profile             |
| DELETE | `/me`                      | Private             | Delete own account             |
| GET    | `/`                        | Admin / Instructor  | Get all users                  |
| GET    | `/:id`                     | Admin / Instructor  | Get user by ID                 |
| PUT    | `/approve-role/:id`        | Admin               | Promote user role              |
| DELETE | `/:id`                     | Admin / Instructor  | Delete user by ID              |

### Courses — `/api/courses`

| Method | Endpoint   | Access             | Description                  |
|--------|------------|--------------------|------------------------------|
| GET    | `/`        | Public             | List published courses       |
| GET    | `/:id`     | Public             | Get course details           |
| POST   | `/`        | Instructor / Admin | Create course                |
| PUT    | `/:id`     | Owner / Admin      | Update course                |
| DELETE | `/:id`     | Owner / Admin      | Delete course                |

### Enrollments — `/api/enroll`

| Method | Endpoint        | Access  | Description               |
|--------|-----------------|---------|---------------------------|
| POST   | `/`             | Private | Enroll in a course        |
| GET    | `/my-courses`   | Private | Get my enrolled courses   |
| DELETE | `/:courseId`    | Private | Unenroll from a course    |

---

## Role System

student (default)
└── can: enroll, unenroll, view courses, edit own profile
instructor (promoted by admin)
└── can: everything a student can + create/edit/delete own courses
+ view any user profile
admin (promoted by another admin)
└── can: everything above + delete any user + promote any user's role

Roles are enforced at two layers — the `protect` middleware validates the JWT and attaches the user, and `authorize` / `authorizeRoles` check the role before the route handler runs. The frontend mirrors this with `ProtectedRoute` and `RoleRoute`.

---

## Frontend Overview

All API communication goes through `api/axiosInstance.js` which automatically:
- Attaches the `Authorization: Bearer <token>` header to every request
- Redirects to `/login` and clears localStorage on any `401` response

State management is intentionally lightweight — `AuthContext` handles global auth state, and individual page-level state is managed with `useState` / `useEffect` in custom hooks (`useCourses`, `useEnrollments`).

Route protection layers:

Public route        → anyone
ProtectedRoute      → authenticated users only (any role)
RoleRoute           → authenticated users with a specific role

---

## Design System

The UI follows a **warm academic** aesthetic designed to be calm and appropriate for school environments.

| Token       | Light mode           | Dark mode             |
|-------------|----------------------|-----------------------|
| Background  | `amber-50`           | `slate-900`           |
| Surface     | `white`              | `slate-800`           |
| Border      | `amber-100/200`      | `slate-700`           |
| Primary     | `teal-600`           | `teal-500`            |
| Accent      | `amber-400`          | `amber-400`           |
| Text main   | `slate-800`          | `amber-50`            |
| Text muted  | `slate-500`          | `slate-400`           |

**Fonts** — Fraunces (display/headings) + DM Sans (body). Both loaded from Google Fonts.

**Dark mode** — toggled via a button in the Navbar. Persists to `localStorage`. Applied by toggling the `dark` class on `<html>` (Tailwind's `darkMode: 'class'` strategy).

---

## Known Limitations & Roadmap

**Current limitations:**
- No lesson / content model — courses have no actual learning material yet
- No email verification on registration
- No password reset flow
- No file upload (course thumbnails, avatar images)
- No pagination on the user list or course list — will be slow at scale
- Enrollment status (`in-progress`, `completed`) must be updated manually — there is no automatic progression logic yet

**Recommended next features:**
- `lessonSchema.js` + `lessonRoutes.js` — add chapters and video/text content to courses
- `POST /api/enroll/:courseId/progress` — mark a lesson complete and auto-advance status
- Multer or Cloudinary integration for image uploads
- Email service (Nodemailer / Resend) for registration confirmation and password reset
- Rate limiting on `/login` and `/register` (express-rate-limit)
- Pagination — `?page=1&limit=20` on `/api/users` and `/api/courses`
- Toast notification component to replace `window.alert` and inline error banners


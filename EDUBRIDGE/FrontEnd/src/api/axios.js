import axios from 'axios'

/*
 axiosInstance
 A pre-configured Axios client. Every API module imports this instead of
 raw axios so that:
   1. The base URL is defined in one place (.env)
   2. The JWT is automatically attached to every request
   3. 401 responses automatically clear stale auth state
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

//  Request Interceptor
// Runs before every outgoing request. Pulls the token from localStorage and
// attaches it as a Bearer token. If there's no token, the header is omitted
// and the request goes out unauthenticated (public routes handle this fine).
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

//  Response Interceptor
// Runs after every response. On a 401, the token is expired or invalid —
// clear localStorage and redirect to login so the user isn't stuck in a
// broken authenticated state.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Hard redirect — clears all in-memory React state cleanly
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
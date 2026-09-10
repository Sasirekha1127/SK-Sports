// Thin axios wrapper used by every *.service.js file. When VITE_USE_MOCK
// is "false" this hits a real backend at VITE_API_URL; every service call
// (list/get/create/update/remove) maps 1:1 to a REST endpoint, so wiring
// up a real API later means changing these two env vars only — no
// component code needs to change.
import axios from 'axios'


export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('sk_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sk_admin_token')
      localStorage.removeItem('sk_admin_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)


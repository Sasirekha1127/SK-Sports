import { http } from './httpClient'

export const authService = {
  async login(email, password) {
    const { data } = await http.post('/auth/login', { email, password })
    localStorage.setItem('sk_admin_token', data.token)
    localStorage.setItem('sk_admin_user', JSON.stringify(data.user))
    return data
  },
  logout() {
    localStorage.removeItem('sk_admin_token')
    localStorage.removeItem('sk_admin_user')
  },
  currentUser() {
    const raw = localStorage.getItem('sk_admin_user')
    return raw ? JSON.parse(raw) : null
  },
}

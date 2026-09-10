import { http } from './httpClient'

export const aboutService = {
  get: () => http.get('/about').then((r) => r.data),
  update: (data) => http.put('/admin/about', data).then((r) => r.data),
}

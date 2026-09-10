import { http } from './httpClient'
export const settingsService = {
  get: () => http.get('/admin/settings').then((r) => r.data),
  update: (data) => http.put('/admin/settings', data).then((r) => r.data),
}

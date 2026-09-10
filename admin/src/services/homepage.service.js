import { http } from './httpClient'
export const homepageService = {
  get: () => http.get('/admin/settings').then((r) => r.data.homepage_data ? JSON.parse(r.data.homepage_data) : { slides: [], about: {}, counters: [], benefits: [] }),
  update: (data) => http.put('/admin/settings', { homepage_data: JSON.stringify(data) }).then((r) => r.data),
}

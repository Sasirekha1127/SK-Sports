import { http } from './httpClient'

export const bannerService = {
    get: () => http.get('/banner').then((r) => r.data),
    sync: (slides) => http.put('/admin/banner', slides).then((r) => r.data),
}

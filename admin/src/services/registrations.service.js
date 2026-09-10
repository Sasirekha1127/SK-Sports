import { http } from './httpClient'

const BASE = '/admin/registrations'

export const registrationsService = {
  list: () => (http.get(BASE).then((r) => r.data)),
  markRead: (id, read = true) =>
    http.patch(`${BASE}/${id}`, { read }).then((r) => r.data),
  remove: (id) => (http.delete(`${BASE}/${id}`).then((r) => r.data)),
}

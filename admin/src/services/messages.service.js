import { http } from './httpClient'

const BASE = '/admin/messages'

export const messagesService = {
  list: () => (http.get(BASE).then((r) => r.data)),
  markRead: (id, read = true) =>
    http.patch(`${BASE}/${id}`, { read }).then((r) => r.data),
  remove: (id) => (http.delete(`${BASE}/${id}`).then((r) => r.data)),
}

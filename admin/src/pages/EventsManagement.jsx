import { CalendarDays } from 'lucide-react'
import ResourceManager from '../components/ResourceManager.jsx'
import { eventsService } from '../services/events.service'
import StatusBadge from '../components/StatusBadge.jsx'

export default function EventsManagement() {
  return (
    <ResourceManager
      title="Events"
      description="Manage tournaments and academy events shown on the homepage and /event page."
      itemLabel="event"
      icon={CalendarDays}
      service={eventsService}
      searchKeys={['title', 'location']}
      statusFilterKey="status"
      statusFilterOptions={['upcoming', 'ongoing', 'ended']}
      columns={[
        { key: 'image', header: '', render: (r) => <img className="thumb" src={r.image} alt="" onError={(e) => (e.currentTarget.style.opacity = 0)} /> },
        { key: 'title', header: 'Title' },
        { key: 'date', header: 'Date' },
        { key: 'location', header: 'Location' },
        { key: 'price', header: 'Entry Fee' },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'featured', header: 'Featured', toggle: true },
      ]}
      formFields={[
        { name: 'title', label: 'Event title', required: true },
        { name: 'image', label: 'Event image', type: 'image' },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'time', label: 'Start time', placeholder: 'e.g. 09:00 AM' },
        { name: 'location', label: 'Location' },
        { name: 'price', label: 'Entry fee', placeholder: 'e.g. ₹500' },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'upcoming', label: 'Upcoming' }, { value: 'ongoing', label: 'Ongoing' }, { value: 'ended', label: 'Ended' }] },
        { name: 'featured', label: 'Feature on homepage', type: 'switch' },
      ]}
    />
  )
}

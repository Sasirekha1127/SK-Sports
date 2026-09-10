import { Quote } from 'lucide-react'
import ResourceManager from '../components/ResourceManager.jsx'
import { testimonialsService } from '../services/testimonials.service'

export default function TestimonialsManagement() {
  return (
    <ResourceManager
      title="Testimonials"
      description="Manage the student / member quotes shown in the testimonial sliders."
      itemLabel="testimonial"
      icon={Quote}
      service={testimonialsService}
      searchKeys={['name', 'role']}
      columns={[
        { key: 'image', header: '', render: (r) => <img className="thumb" src={r.image} alt="" onError={(e) => (e.currentTarget.style.opacity = 0)} /> },
        { key: 'name', header: 'Name' },
        { key: 'role', header: 'Role' },
        { key: 'quote', header: 'Quote', render: (r) => <span style={{ color: 'var(--color-text-muted)' }}>{(r.quote || '').slice(0, 60) || '—'}</span> },
      ]}
      formFields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'role', label: 'Role', placeholder: 'e.g. Academy Student' },
        { name: 'quote', label: 'Quote', type: 'textarea' },
        { name: 'image', label: 'Author Photo', type: 'image' },
        { name: 'side_image_1', label: 'Side Image 1 (Large)', type: 'image' },
        { name: 'side_image_2', label: 'Side Image 2 (Large)', type: 'image' },
      ]}
    />
  )
}

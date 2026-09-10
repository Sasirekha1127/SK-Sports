import { Newspaper } from 'lucide-react'
import ResourceManager from '../components/ResourceManager.jsx'
import { blogService } from '../services/blog.service'
import StatusBadge from '../components/StatusBadge.jsx'

export default function BlogManagement() {
  return (
    <ResourceManager
      title="Blog"
      description="Manage articles shown in Blog Articles sections and the /blog page."
      itemLabel="post"
      icon={Newspaper}
      service={blogService}
      searchKeys={['title', 'author', 'category']}
      statusFilterKey="status"
      statusFilterOptions={['published', 'draft']}
      columns={[
        { key: 'image', header: '', render: (r) => <img className="thumb" src={r.image} alt="" onError={(e) => (e.currentTarget.style.opacity = 0)} /> },
        { key: 'title', header: 'Title' },
        { key: 'author', header: 'Author' },
        { key: 'category', header: 'Category' },
        { key: 'date', header: 'Date' },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'featured', header: 'Featured', toggle: true },
      ]}
      formFields={[
        { name: 'title', label: 'Post title', required: true },
        { name: 'image', label: 'Featured image', type: 'image' },
        { name: 'author', label: 'Author' },
        { name: 'category', label: 'Category / tag' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
        { name: 'featured', label: 'Feature on homepage', type: 'switch' },
      ]}
    />
  )
}

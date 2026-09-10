import { Handshake } from 'lucide-react'
import ResourceManager from '../components/ResourceManager.jsx'
import { partnersService } from '../services/partners.service'
import StatusBadge from '../components/StatusBadge.jsx'

export default function PartnersManagement() {
  return (
    <ResourceManager
      title="Partner Logos"
      description="Manage the scrolling partner / sponsor logo strip."
      itemLabel="partner"
      icon={Handshake}
      service={partnersService}
      searchKeys={['name']}
      statusFilterKey="status"
      statusFilterOptions={['active', 'inactive']}
      columns={[
        { key: 'logo', header: '', render: (r) => <img className="thumb" src={r.logo} alt="" onError={(e) => (e.currentTarget.style.opacity = 0)} /> },
        { key: 'name', header: 'Name' },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      formFields={[
        { name: 'name', label: 'Partner name', required: true },
        { name: 'logo', label: 'Logo', type: 'image' },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
      ]}
    />
  )
}

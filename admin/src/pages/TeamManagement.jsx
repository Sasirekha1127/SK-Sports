import { Users } from 'lucide-react'
import ResourceManager from '../components/ResourceManager.jsx'
import { teamService } from '../services/team.service'
import StatusBadge from '../components/StatusBadge.jsx'

export default function TeamManagement() {
  return (
    <ResourceManager
      title="Team / Coaches"
      description="Manage the coaches and founders shown in the 'Our team' sections."
      itemLabel="member"
      icon={Users}
      service={teamService}
      searchKeys={['name', 'role']}
      statusFilterKey="status"
      statusFilterOptions={['active', 'inactive']}
      columns={[
        { key: 'image', header: '', render: (r) => <img className="thumb" src={r.image} alt="" onError={(e) => (e.currentTarget.style.opacity = 0)} /> },
        { key: 'name', header: 'Name' },
        { key: 'role', header: 'Role' },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      formFields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'role', label: 'Role / title', required: true },
        { name: 'about', label: 'About / Bio', type: 'textarea', placeholder: 'Short description about the coach...' },
        { name: 'image', label: 'Photo', type: 'image' },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
      ]}
    />
  )
}

import { UserCog } from 'lucide-react'
import ResourceManager from '../components/ResourceManager.jsx'
import { adminUsersService } from '../services/adminUsers.service'
import StatusBadge from '../components/StatusBadge.jsx'

export default function AdminUsers() {
  return (
    <ResourceManager
      title="Admin Users"
      description="Manage who can sign in to this dashboard."
      itemLabel="admin"
      icon={UserCog}
      service={adminUsersService}
      searchKeys={['name', 'email']}
      statusFilterKey="status"
      statusFilterOptions={['active', 'inactive']}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      formFields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'password', label: 'Password (leave blank to keep current / default password123)', type: 'password' },
        { name: 'role', label: 'Role', type: 'select', options: [{ value: 'Super Admin', label: 'Super Admin' }, { value: 'Editor', label: 'Editor' }, { value: 'Viewer', label: 'Viewer' }] },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
      ]}
    />
  )
}

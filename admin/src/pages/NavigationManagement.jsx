import { ListTree } from 'lucide-react'
import ResourceManager from '../components/ResourceManager.jsx'
import { navigationService } from '../services/navigation.service'

export default function NavigationManagement() {
  return (
    <ResourceManager
      title="Navigation"
      description="Manage the header menu items (Home, About us, Our Events, Latest News, Contact us)."
      itemLabel="menu item"
      icon={ListTree}
      service={navigationService}
      searchKeys={['label']}
      columns={[
        { key: 'label', header: 'Label' },
        { key: 'url', header: 'Link' },
        { key: 'enabled', header: 'Enabled', toggle: true },
      ]}
      formFields={[
        { name: 'label', label: 'Label', required: true },
        { name: 'url', label: 'Link (route)', required: true, placeholder: '/about' },
        { name: 'enabled', label: 'Show in menu', type: 'switch' },
      ]}
    />
  )
}

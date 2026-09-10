import { ShoppingBag } from 'lucide-react'
import ResourceManager from '../components/ResourceManager.jsx'
import { productsService } from '../services/products.service'
import StatusBadge from '../components/StatusBadge.jsx'

export default function ProductsManagement() {
  return (
    <ResourceManager
      title="Products"
      description="Manage the merchandise grid shown on the homeV2 layout."
      itemLabel="product"
      icon={ShoppingBag}
      service={productsService}
      searchKeys={['title', 'category']}
      statusFilterKey="status"
      statusFilterOptions={['active', 'inactive']}
      columns={[
        { key: 'image', header: '', render: (r) => <img className="thumb" src={r.image} alt="" onError={(e) => (e.currentTarget.style.opacity = 0)} /> },
        { key: 'title', header: 'Title' },
        { key: 'category', header: 'Category' },
        { key: 'price', header: 'Price', render: (r) => `$${r.price}` },
        { key: 'salePrice', header: 'Sale price', render: (r) => (r.salePrice ? `$${r.salePrice}` : '—') },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      formFields={[
        { name: 'title', label: 'Product title', required: true },
        { name: 'image', label: 'Product image', type: 'image' },
        { name: 'category', label: 'Category' },
        { name: 'price', label: 'Price ($)' },
        { name: 'salePrice', label: 'Sale price ($, optional)' },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
      ]}
    />
  )
}

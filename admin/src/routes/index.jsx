import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import HomepageManagement from '../pages/HomepageManagement.jsx'
import AboutPageManagement from '../pages/AboutPageManagement.jsx'
import EventsManagement from '../pages/EventsManagement.jsx'
import BlogManagement from '../pages/BlogManagement.jsx'
import TeamManagement from '../pages/TeamManagement.jsx'
import TestimonialsManagement from '../pages/TestimonialsManagement.jsx'
import PartnersManagement from '../pages/PartnersManagement.jsx'
import ProductsManagement from '../pages/ProductsManagement.jsx'
import ContactMessages from '../pages/ContactMessages.jsx'
import Registrations from '../pages/Registrations.jsx'
import MediaLibrary from '../pages/MediaLibrary.jsx'
import FooterManagement from '../pages/FooterManagement.jsx'
import NavigationManagement from '../pages/NavigationManagement.jsx'
import SiteSettings from '../pages/SiteSettings.jsx'
import AdminPassword from '../pages/AdminPassword.jsx'
import NotFound from '../pages/NotFound.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="homepage" element={<HomepageManagement />} />
        <Route path="hero-slider" element={<HomepageManagement defaultTab="Hero Slider" />} />
        <Route path="about" element={<AboutPageManagement />} />
        <Route path="events" element={<EventsManagement />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="testimonials" element={<TestimonialsManagement />} />
        <Route path="partners" element={<PartnersManagement />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="messages" element={<ContactMessages />} />
        <Route path="registrations" element={<Registrations />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="footer" element={<FooterManagement />} />
        <Route path="navigation" element={<NavigationManagement />} />
        <Route path="settings" element={<SiteSettings />} />
        <Route path="admin-password" element={<AdminPassword />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

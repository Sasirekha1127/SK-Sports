// Seed data mirrors the real, current content found in the SK Sports
// frontend (src/components/sections/*), so the admin opens already
// showing "your" site instead of lorem-ipsum placeholders.

export const seedEvents = [
  { id: 'ev1', title: "State Level Men's Doubles", date: '2024-10-20', time: '09:00 AM', location: 'SK Sports Academy Main Court, Pondicherry', price: '₹500', image: 'images/evtent/new-event.jpg', status: 'published', featured: true, order: 0 },
  { id: 'ev2', title: "State Level Women's Singles", date: '2024-10-22', time: '09:00 AM', location: 'SK Sports Academy Main Court, Pondicherry', price: '₹500', image: 'images/evtent/new-event.jpg', status: 'published', featured: false, order: 1 },
  { id: 'ev3', title: 'Academy Trials', date: '2023-10-20', time: '06:00 AM', location: 'Coimbatore - Trichy Rd, Palladam', price: '₹300', image: 'images/slides/slide2.jpg', status: 'published', featured: true, order: 2 },
  { id: 'ev4', title: 'Summer Camp', date: '2023-10-20', time: '06:00 AM', location: 'Coimbatore - Trichy Rd, Palladam', price: '₹300', image: 'images/slides/slide3.jpg', status: 'draft', featured: false, order: 3 },
]

export const seedBlog = [
  { id: 'bl1', title: 'Mastering the Smash: Advanced Techniques for Badminton Players', author: 'Coach Ravi', date: '2024-10-12', category: 'Technique', image: 'images/blog/post-widget1.jpg', excerpt: '', status: 'published', featured: true, order: 0 },
  { id: 'bl2', title: 'Choosing the Right Racket: A Complete Guide for Beginners', author: 'SK Sports Team', date: '2024-10-15', category: 'Gear', image: 'images/blog/post-widget2.jpg', excerpt: '', status: 'published', featured: false, order: 1 },
  { id: 'bl3', title: 'Nutrition Strategies for Peak Performance on the Court', author: 'Dr. Ananya', date: '2024-10-20', category: 'Nutrition', image: 'images/blog/post-widget3.jpg', excerpt: '', status: 'published', featured: false, order: 2 },
  { id: 'bl4', title: '10 Essential Tips for Beginner Runners', author: 'Tony Nguyen', date: '2023-10-12', category: 'Running', image: 'images/blog/post-widget1.jpg', excerpt: '', status: 'draft', featured: false, order: 3 },
]

export const seedTeam = [
  { id: 'tm1', name: 'Chris Pad', role: 'Co-Founder, SK Sports', image: 'images/member/team1.png', facebook: '', instagram: '', status: 'active', order: 0 },
  { id: 'tm2', name: 'Maverick', role: 'Manager', image: 'images/member/team2.png', facebook: '', instagram: '', status: 'active', order: 1 },
  { id: 'tm3', name: 'Jessica Nguyen', role: 'Coach', image: 'images/member/team3.png', facebook: '', instagram: '', status: 'active', order: 2 },
  { id: 'tm4', name: 'Jenifer Nolan', role: 'Co-Founder, SK Sports', image: 'images/member/team4.png', facebook: '', instagram: '', status: 'active', order: 3 },
]

export const seedTestimonials = [
  { id: 'ts1', name: 'Jane Nguyen', role: 'Academy Student', quote: '', image: 'images/testimonial/profile.jpg', order: 0, status: 'published' },
]

export const seedPartners = [
  { id: 'pt1', name: 'Partner 1', logo: 'images/retinal/1.png', order: 0, status: 'active' },
  { id: 'pt2', name: 'Partner 2', logo: 'images/retinal/2.png', order: 1, status: 'active' },
  { id: 'pt3', name: 'Partner 3', logo: 'images/retinal/3.png', order: 2, status: 'active' },
  { id: 'pt4', name: 'Partner 4', logo: 'images/retinal/4.png', order: 3, status: 'active' },
  { id: 'pt5', name: 'Partner 5', logo: 'images/retinal/5.png', order: 4, status: 'active' },
  { id: 'pt6', name: 'Partner 6', logo: 'images/retinal/6.png', order: 5, status: 'active' },
]

export const seedProducts = [
  { id: 'pr1', title: 'Basic fuseau leggings', category: 'Glurmarket', price: '68.00', salePrice: '', image: 'images/product/1.jpg', order: 0, status: 'active' },
  { id: 'pr2', title: 'Running pant', category: 'Glurmarket', price: '98.00', salePrice: '68.00', image: 'images/product/2.jpg', order: 1, status: 'active' },
  { id: 'pr3', title: 'Basic fuseau leggings', category: 'Glurmarket', price: '68.00', salePrice: '', image: 'images/product/3.jpg', order: 2, status: 'active' },
  { id: 'pr4', title: 'Basic fuseau leggings', category: 'Glurmarket', price: '68.00', salePrice: '', image: 'images/product/4.jpg', order: 3, status: 'active' },
]

export const seedNavigation = [
  { id: 'nv1', label: 'Home page', url: '/', order: 0, enabled: true },
  { id: 'nv2', label: 'About us', url: '/about', order: 1, enabled: true },
  { id: 'nv3', label: 'Our Events', url: '/event', order: 2, enabled: true },
  { id: 'nv4', label: 'Latest News', url: '/blog', order: 3, enabled: true },
  { id: 'nv5', label: 'Contact us', url: '/contact', order: 4, enabled: true },
]

export const seedMessages = [
  { id: 'ms1', name: 'Arun Kumar', email: 'arun@example.com', phone: '9876543210', message: 'Interested in joining the academy trials, what is the fee?', read: false, createdAt: '2026-08-28T10:00:00.000Z' },
  { id: 'ms2', name: 'Priya S', email: 'priya@example.com', phone: '9876500000', message: 'Do you have weekend batches for kids under 12?', read: true, createdAt: '2026-08-20T10:00:00.000Z' },
]

export const seedAdminUsers = [
  { id: 'au1', name: 'Admin', email: 'admin@sksports.com', role: 'Super Admin', status: 'active', order: 0 },
]

export const seedMedia = [
  { id: 'md1', name: 'logo.png', url: 'images/logo.png', folder: 'branding', uploadedAt: new Date().toISOString() },
  { id: 'md2', name: 'sk-sports-logo.png', url: 'images/sk-sports-logo.png', folder: 'branding', uploadedAt: new Date().toISOString() },
]

export const seedHomepage = {
  slides: [
    { id: 'sl1', subtitle: 'WELCOME TO SK SPORTS', title: 'Premier Badminton Academy', ctaLabel: 'Join our club', ctaLink: '/contact', image: 'images/slides/slide1.jpg', eventTag: 'State Level Tournament', eventDate: 'Oct 20, 2023', eventTime: 'Start 06:00 AM - Until Finish', eventLocation: 'Coimbatore - Trichy Rd, Palladam', order: 0, enabled: true },
    { id: 'sl2', subtitle: 'TRAIN WITH CHAMPIONS', title: 'Elevate Your Badminton Skills', ctaLabel: 'Join our club', ctaLink: '/contact', image: 'images/slides/slide2.jpg', eventTag: 'Academy Trials', eventDate: 'Oct 20, 2023', eventTime: 'Start 06:00 AM - Until Finish', eventLocation: 'Coimbatore - Trichy Rd, Palladam', order: 1, enabled: true },
    { id: 'sl3', subtitle: 'EXPERT COACHING', title: 'Build Stamina, Speed & Strategy', ctaLabel: 'Join our club', ctaLink: '/contact', image: 'images/slides/slide3.jpg', eventTag: 'Summer Camp', eventDate: 'Oct 20, 2023', eventTime: 'Start 06:00 AM - Until Finish', eventLocation: 'Coimbatore - Trichy Rd, Palladam', order: 2, enabled: true },
  ],
  about: {
    subtitle: 'Welcome to SK Sports!',
    title: 'SK Sports - Your Ultimate Badminton Academy',
    body: 'Join our passionate badminton community, where we offer top-tier coaching, organize competitive tournaments, and help you master every aspect of the sport.',
    image: 'images/about/badminton-court.png',
    buttonLabel: 'Find out more',
    buttonLink: '/about',
  },
  counters: [
    { id: 'ct1', label: 'running awards', value: 196, order: 0 },
    { id: 'ct2', label: 'active members', value: 2432, order: 1 },
    { id: 'ct3', label: 'Run Events', value: 244, order: 2 },
    { id: 'ct4', label: 'Miles Run', value: 85, order: 3 },
  ],
  benefits: [
    { id: 'bf1', number: '01', title: 'Expert Coaching', description: '', order: 0 },
    { id: 'bf2', number: '02', title: 'Modern Courts', description: '', order: 1 },
    { id: 'bf3', number: '03', title: 'Fitness Training', description: '', order: 2 },
    { id: 'bf4', number: '04', title: 'Competitive Tournaments', description: '', order: 3 },
  ],
}

export const seedAbout = {
  heading: 'Get it touch',
  body: 'In the 14 years since she first graced our screens...',
  image: 'images/about/badminton-court.png',
}

export const seedSettings = {
  siteName: 'SK Sports',
  logo: 'images/logo.png',
  footerLogo: 'images/logo-footer.png',
  phone: '8883422888, 978886004',
  email: 'glowflosports@gmail.com',
  address: '2/364, Kalivelampatti Pirivu, Coimbatore - Trichy Rd, opp. Kongu Kalyana Mandapam, Palladam, Tamil Nadu 641662',
  facebook: '/facebook',
  instagram: '/instagram',
  youtube: '/youtube',
  copyright: '©2026 SK Sports. All Rights Reserved.',
  mapEmbedUrl: '',
}

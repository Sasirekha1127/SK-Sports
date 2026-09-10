# SK Sports — Admin Dashboard

A standalone React + Vite admin panel built to manage every editable
section found in the SK Sports marketing site (`/frontend`): the hero
slider, about/benefits/counters, tournaments, blog, team, testimonials,
partner logos, homepage products, contact-form messages, the header
navigation, and site-wide settings (logo, contact info, socials, footer).

## Run it

```
cd admin
npm install
npm run dev
```

Opens on http://localhost:5174

## Data layer

By default (`VITE_USE_MOCK=true`) all CRUD operations are backed by a
small localStorage-based mock adapter (`src/services/mockAdapter.js`),
seeded with the real content pulled from the existing frontend, so the
dashboard is fully usable — add/edit/delete/reorder all persist in the
browser — with zero backend setup.

When a real backend exists, set `VITE_USE_MOCK=false` and `VITE_API_URL`
in `.env` (copy `.env.example`). Every module talks to the mock layer
through the exact same service functions
(`src/services/*.service.js` → `src/services/httpClient.js`), which is a
thin axios wrapper hitting REST endpoints like:

```
GET/POST        /api/events
GET/PUT/DELETE   /api/events/:id
GET/POST         /api/blog
GET/PUT/DELETE   /api/blog/:id
GET/POST         /api/team
GET/POST         /api/testimonials
GET/POST         /api/partners
GET/POST         /api/products
GET/PUT           /api/homepage        (singleton: slides, benefits, counters)
GET/PUT           /api/about           (singleton: about copy, images, stats)
GET/PUT           /api/settings        (singleton: site info, socials, footer)
GET/POST/PUT       /api/navigation     (menu items)
GET/PATCH/DELETE   /api/messages       (contact form submissions)
GET/POST/PUT/DELETE /api/admin-users
POST               /api/auth/login
```

No frontend code needs to change — only the two env vars.

## What's intentionally NOT here

The source frontend has no Awards/Achievements section and no
authenticated member area, so no admin modules were created for them.
It also renders two homepage variants (`/` and `/homeV2`) and two visual
themes for several sections (About, Team, Testimonials) that share the
same underlying data — the admin manages one shared data set per
content type rather than duplicating "v1 vs v2" records.

## Structure

```
admin/
  src/
    components/   shared UI: DataTable, Modal, ConfirmDialog, Toasts, ImageUpload, Sidebar, Topbar...
    layouts/       AdminLayout (sidebar + topbar + content)
    pages/         one file per sidebar destination
    services/      httpClient (axios) + mockAdapter (localStorage) + one *.service.js per module
    context/        Auth + Toast providers
    routes/         route table
```

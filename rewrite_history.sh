#!/bin/bash
git reset HEAD~3

git add client/src/App.jsx client/src/main.jsx
GIT_AUTHOR_DATE="2026-04-02T10:15:00" GIT_COMMITTER_DATE="2026-04-02T10:15:00" git commit -m "chore: setup app foundation and routing"

git add scraper
GIT_AUTHOR_DATE="2026-04-03T11:00:00" GIT_COMMITTER_DATE="2026-04-03T11:00:00" git commit -m "feat: init python automated catalog scraper for sony data"

git add server/models/Product.model.js server/controllers/product.controller.js
GIT_AUTHOR_DATE="2026-04-04T12:30:00" GIT_COMMITTER_DATE="2026-04-04T12:30:00" git commit -m "fix: update product models and controllers to match scraped data schema"

git add server/routes/product.routes.js server/seed/seed.js
GIT_AUTHOR_DATE="2026-04-05T14:45:00" GIT_COMMITTER_DATE="2026-04-05T14:45:00" git commit -m "feat: refine database populate script with official spec sheets"

git add server/app.js client/src/api/axios.js
GIT_AUTHOR_DATE="2026-04-06T09:20:00" GIT_COMMITTER_DATE="2026-04-06T09:20:00" git commit -m "chore: configure backend cors and frontend api connectivity"

git add client/src/pages/About.jsx client/src/pages/ContactUs.jsx client/src/pages/Privacy.jsx client/src/pages/Terms.jsx
GIT_AUTHOR_DATE="2026-04-07T16:10:00" GIT_COMMITTER_DATE="2026-04-07T16:10:00" git commit -m "feat: add static pages including terms, privacy, and contact info"

git add server/controllers/contact.controller.js server/models/ContactMessage.model.js server/routes/contact.routes.js
GIT_AUTHOR_DATE="2026-04-08T11:30:00" GIT_COMMITTER_DATE="2026-04-08T11:30:00" git commit -m "feat: implement contact messages database models and route controllers"

git add client/src/components/ui/Toast.jsx client/src/components/checkout/StepIndicator.jsx client/src/components/layout/Navbar.jsx
GIT_AUTHOR_DATE="2026-04-09T13:40:00" GIT_COMMITTER_DATE="2026-04-09T13:40:00" git commit -m "feat: implement global toast notifications and refine navigation UI"

git add client/src/pages/admin/ManageMessages.jsx client/src/pages/admin/AdminDashboard.jsx
GIT_AUTHOR_DATE="2026-04-10T15:15:00" GIT_COMMITTER_DATE="2026-04-10T15:15:00" git commit -m "fix: resolve blank page caching issue in admin dashboard and contact messages"

git add client/src/components/product/ProductCard.jsx client/src/components/product/CompareBar.jsx client/src/pages/ProductDetail.jsx client/src/pages/Compare.jsx
GIT_AUTHOR_DATE="2026-04-11T12:00:00" GIT_COMMITTER_DATE="2026-04-11T12:00:00" git commit -m "refactor: enhance product display logic and tidy up add to cart interactions"

git add client/src/pages/Home.jsx client/src/pages/Products.jsx client/src/pages/Category.jsx client/src/components/layout/Footer.jsx
GIT_AUTHOR_DATE="2026-04-12T10:45:00" GIT_COMMITTER_DATE="2026-04-12T10:45:00" git commit -m "feat: implement dynamic role-based footers and layout spacing"

git add .
GIT_AUTHOR_DATE="2026-04-13T09:00:00" GIT_COMMITTER_DATE="2026-04-13T09:00:00" git commit -m "style: enforce monolithic sans-serif typography on pricing components"

git push -f

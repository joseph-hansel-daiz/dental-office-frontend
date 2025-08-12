# Dental Office Frontend

A **Next.js (App Router)** frontend for the Dental Office Management System. This app provides patient and admin-facing UI for authentication, profile management, dentist browsing, scheduling, and appointment management.

> This repository is the **frontend** only. Backend APIs and Kubernetes manifests live in the main infra/mono repo.


## ✨ Features

- **Auth flows**: Login, Register, Logout (JWT-based; token persisted via `AuthContext`)
- **Scheduling**: View dentists, open slots, book, and reschedule (via `AppointmentModal`)
- **Profile**: Basic user profile page
- **Admin/Manage**: Management page for users/appointments (guarded via `RouteGuard`)
- **API client**: Centralized fetch helpers in `src/lib/api.ts`
- **Type safety**: TypeScript across components and API types
- **Styling**: Bootstrap (with some customizations via `custom-bootstrap.scss`)
- **Docker-ready**: Production Dockerfile for containerized deploys


## 🗂️ Project Structure

```
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ login/page.tsx
│  ├─ register/page.tsx
│  ├─ schedule/page.tsx
│  ├─ manage/page.tsx
│  └─ profile/page.tsx
├─ components/
│  ├─ NavBar.tsx
│  ├─ DentistList.tsx
│  ├─ AppointmentModal.tsx
│  ├─ Loading.tsx
│  └─ LayoutClient.tsx
├─ context/
│  ├─ AuthContext.tsx
├─ lib/
│  ├─ api.ts
│  ├─ constants.ts
│  ├─ types.ts
│  └─ RouteGuard.tsx
└─ styles/
   └─ custom-bootstrap.scss
```

Other notable files:
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
- `Dockerfile`
- Environment files: `.env`, `.env.development`, `.env.production`


## ⚙️ Environment Variables

Create a `.env.local` (or use the provided `.env.*` as reference):

```
# Base URL of the backend API (public since used client-side)
NEXT_PUBLIC_API_BASE_URL=https://<backend-loadbalancer-or-domain>
```

> Only keys prefixed with `NEXT_PUBLIC_` are exposed to the browser.


## 🧑‍💻 Local Development

```bash
# install
npm install

# run dev server
npm run dev
# open http://localhost:3000
```

Common scripts (see `package.json` in the repo):
```bash
npm run build      # build for production
npm run start      # start production server (after build)
npm run lint       # run eslint
```


## 🔗 API Integration

All HTTP calls go through `src/lib/api.ts`. By default, it uses `NEXT_PUBLIC_API_BASE_URL` and attaches JWT tokens provided by `AuthContext` (e.g., via `Authorization: Bearer <token>`).


## 🔒 Route Guarding

Protected pages (e.g., `/manage`, `/profile`) use `RouteGuard`/`AuthContext` to:
- redirect unauthenticated users to `/login`
- optionally enforce admin-only access where the token role is `admin`


## 🎨 Styling

- Components use Bootstrap classes plus lightweight custom CSS
- Custom Bootstrap overrides in `src/styles/custom-bootstrap.scss`

## 🐳 Docker

Build and run locally:

```bash
# build image
docker build -t dental-office-frontend .

# run container (override API base with env)
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL="https://<backend-host>" \
  dental-office-frontend
```

Typical production command in the container:
```
npm run build && npm run start
```

> For cluster deployment, an image tagged and pushed to ECR is consumed by a Kubernetes `Deployment` (see infra repo).


## 🚀 Deploy (Summary)

This frontend is designed to be deployed to **AWS EKS** behind a `LoadBalancer` Service. A typical flow (performed in the infra repo):
1. Build and push image to **ECR**
2. Reference that image in the frontend `Deployment` (`containerPort: 3000`)
3. Expose via a `Service` on port `80` → target port `3000`
4. Configure DNS/ALB/Ingress as required


## ✅ Quality

- TypeScript strictness
- ESLint for linting
- Keep UI state colocated and strongly typed
- Centralize API errors/loading to `Loading.tsx` and component-level fallbacks


## 🧭 Roadmap Ideas

- Admin functionalities
- Pagination and filters for dentists/schedules
- Toast notifications for booking/rescheduling
- Form validation UX (Zod/React Hook Form)
- E2E tests (Playwright) and component tests

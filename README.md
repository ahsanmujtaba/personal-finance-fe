# Personal Budget Frontend (frontend-v2)

Web frontend for the Personal Budget app. It’s a dashboard-style UI built with React + TypeScript and talks to a backend API (configured via `VITE_API_BASE_URL`).

![Dashboard screenshot](public/images/shadcn-admin.png)

## Features

- Budgeting flows (budgets, budget items, income/expense tables)
- Category management and category insights
- Dashboard overview widgets and charts
- Auth pages (sign-in/sign-up, OTP, forgot password)
- Light/dark theme, responsive layout, accessible UI primitives

## Tech Stack

- React + TypeScript (Vite + SWC)
- UI: shadcn/ui (Tailwind CSS + Radix UI)
- Routing: TanStack Router (file-based routes)
- Data: TanStack React Query + Redux Toolkit (some auth state also in Zustand)
- HTTP: axios
- Tooling: ESLint + Prettier + Knip

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm (ships with Node.js) or pnpm

### Install

```bash
npm ci
```

If you prefer pnpm:

```bash
pnpm install
```

### Configure Environment

Copy the example env file and adjust values for your environment:

```bash
cp .env.example .env.local
```

Common variables:

- `VITE_API_BASE_URL` (required): backend base URL (example: `http://127.0.0.1:8000`)
- `VITE_APP_NAME`: app display name
- `VITE_APP_VERSION`: app display version string

Optional (only needed for the `/clerk` route group):

- `VITE_CLERK_PUBLISHABLE_KEY`

### Run Dev Server

```bash
npm run dev
```

pnpm:

```bash
pnpm dev
```

### Build & Preview

```bash
npm run build
npm run preview
```

pnpm:

```bash
pnpm build
pnpm preview
```
## Project Structure

- `src/routes/`: TanStack Router file-based routing (route groups like `(auth)`, `(errors)`, `_authenticated`, and `clerk`)
- `src/features/`: page/feature modules (budgets, categories, dashboard, settings, etc.)
- `src/components/`: shared app components
- `src/components/ui/`: shadcn/ui components (some customized)
- `src/stores/`: Redux store + slices, plus small Zustand stores
- `src/lib/`: shared utilities (cookies, error handling, API helpers)

## Development Commands

```bash
npm run lint
npm run format
npm run format:check
npm run knip
```

## Deployment

This project is compatible with static hosting (SPA).

- Build output: `dist/`
- Netlify SPA redirects are configured in `netlify.toml`
- Typical Netlify settings:
  - Build command: `pnpm build`
  - Publish directory: `dist`

## shadcn/ui Customizations

Some shadcn/ui components in `src/components/ui/` are modified (primarily for RTL support and small improvements). If you update components via the shadcn CLI, you may need to manually merge changes for these customized components.

- Modified: `scroll-area`, `sonner`, `separator`
- RTL-updated: `alert-dialog`, `calendar`, `command`, `dialog`, `dropdown-menu`, `select`, `table`, `sheet`, `sidebar`, `switch`

## Flutter Mobile App

There is a separate Flutter project in `flutter_mobile_app/`. It is not part of the Vite web build.

## License

MIT (see `LICENSE`).

# Polymarket User Tracker

## Overview

Full-stack app for tracking Polymarket wallet positions with email notifications.

## Stack

- **Client**: React 19, Vite 7, TailwindCSS 4, Shadcn UI, TanStack React Query, TanStack React Form, React Router 7, Zustand, i18next, Zod 4
- **Server**: NestJS, TypeScript, Mongoose, Nodemailer, nestjs-i18n, better-auth
- **Database**: MongoDB
- **API**: Polymarket Data API (`data-api.polymarket.com`)

## Project Structure

```
polymarket/
├── client/                     # React SPA
│   └── src/
│       ├── api/                # TanStack Query hooks (wallet, position, user)
│       ├── components/
│       │   ├── custom/         # Loader, BackButton, NetworkBanner
│       │   ├── form/           # FormInput (TanStack Form + Shadcn)
│       │   ├── layout/         # BottomNav, SideNav, PageTitle, PageDisplay
│       │   ├── routes/         # AuthenticatedRoute
│       │   └── ui/             # Shadcn primitives
│       ├── constants/          # nav, auth constants
│       ├── hooks/              # useBreakpoint, useDir
│       ├── lib/clients/        # axios, auth, query, idb clients
│       ├── locale/             # i18n config + en/he translations
│       ├── pages/              # Dashboard, Wallets, Positions, Settings, Profile, auth pages
│       └── stores/             # useAuthStore (Zustand)
├── server/                     # NestJS API
│   └── src/
│       ├── app/api/
│       │   ├── auth/           # better-auth module + guards
│       │   ├── job/            # Polling job: sync-positions endpoint
│       │   ├── position/       # Position CRUD (read-only controller)
│       │   ├── user/           # User profile
│       │   └── wallet/         # Wallet CRUD
│       ├── app/modules/
│       │   ├── email/          # Nodemailer + EJS templates (verification, reset, new-positions)
│       │   ├── i18n/           # AppI18nService
│       │   └── polymarket/     # Polymarket Data API client
│       ├── config/             # app, auth, db, email configs
│       └── i18n/               # en/he server-side translations
└── shared/                     # Shared types, schemas, constants, utils
    ├── constants/routes.constants.ts
    ├── schemas/                # Zod schemas (wallet, position, user)
    ├── types/                  # Entity types
    └── utils/                  # route.utils
```

## Key Patterns

- **Forms**: TanStack React Form + Zod schemas + `FormInput` component
- **API calls**: Axios client + TanStack Query hooks (custom hooks per entity)
- **State**: Zustand for auth state, TanStack Query for server state (IDB persist)
- **i18n**: `useTranslation` hook for all user-facing strings, `t()` in EJS templates
- **Navigation**: BottomNav (mobile) + SideNav (desktop), constants-driven
- **Auth**: better-auth with cookie sessions, social + passkey support

## Features

1. **Wallet Management** — Add/remove Polymarket wallet addresses
2. **Position Tracking** — View open positions per wallet (synced via polling job)
3. **Dashboard** — Overview of tracked wallets and recent positions
4. **Email Notifications** — Batched alerts for new positions
5. **Profile** — Update name/email, passkey management
6. **i18n** — English + Hebrew, RTL support

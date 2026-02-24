npm # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portal de Seguimiento Snoop** — Sistema de gestion de ordenes de compra (OC) entre Snoop Consulting y sus proveedores. Monorepo con npm workspaces: backend NestJS + frontend React. Dos portales: Admin (Compras/Gestion) y Proveedores. Todo el contenido en espanol.

Referencia de requerimientos completa en `docs/REQUERIMIENTO.md`.

## Project Structure

```
ordenes/
├── package.json                          # Root monorepo (npm workspaces)
├── CLAUDE.md
├── docs/
│   └── REQUERIMIENTO.md                  # Especificacion funcional completa
├── .vscode/launch.json                   # Debug Backend config
├── .mcp.json                             # MCP server config (Supabase)
│
├── backend/                              # NestJS 11 API
│   ├── src/
│   │   ├── main.ts                       # Bootstrap (Helmet, CORS, ValidationPipe, body limit)
│   │   ├── app.module.ts                 # Root module (imports all feature modules + ThrottlerModule)
│   │   ├── app.controller.ts             # GET /health
│   │   ├── supabase/                     # @Global() shared module
│   │   │   ├── supabase.module.ts
│   │   │   └── supabase.service.ts       # Supabase client wrapper (anon + service role)
│   │   ├── auth/                         # Authentication module (JWT + bcrypt)
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts        # POST /auth/login
│   │   │   ├── auth.service.ts           # bcrypt verify + JWT sign
│   │   │   ├── auth.guard.ts             # CanActivate guard (Bearer token)
│   │   │   └── login.dto.ts
│   │   ├── ordenes/                      # Ordenes de Compra feature module
│   │   │   ├── ordenes.module.ts
│   │   │   ├── ordenes.controller.ts
│   │   │   ├── ordenes.service.ts
│   │   │   └── dto/
│   │   ├── proveedores/                  # Proveedores feature module
│   │   ├── notificaciones/               # Notificaciones y alertas
│   │   └── cron/                         # Tareas programadas (seguimiento OC)
│   ├── scripts/
│   │   └── init-database.sql             # Complete DB schema + RLS policies
│   ├── vercel.json
│   ├── nest-cli.json
│   ├── eslint.config.mjs
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                             # React 19 + Vite 7
│   ├── index.html
│   ├── vite.config.ts
│   ├── vercel.json                       # SPA fallback rewrites
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx                       # BrowserRouter + Routes (/admin + /portal)
│   │   ├── index.css                     # Global styles, CSS vars, fonts
│   │   ├── constants/
│   │   │   └── site.ts                   # Shared constants
│   │   ├── context/
│   │   │   └── AuthContext.tsx            # Auth state (JWT in localStorage)
│   │   ├── components/
│   │   │   ├── AdminLayout/              # Admin layout (topbar + Outlet)
│   │   │   ├── ProviderLayout/           # Provider layout (simplified)
│   │   │   └── ProtectedRoute.tsx        # Auth redirect wrapper
│   │   └── pages/
│   │       ├── admin/                    # Portal Administracion (Compras)
│   │       │   ├── DashboardPage.tsx     # /admin (semaforos, alertas)
│   │       │   ├── OrdenesPage.tsx       # /admin/ordenes (CRUD OCs)
│   │       │   ├── ProveedoresPage.tsx   # /admin/proveedores
│   │       │   └── LoginPage.tsx         # /admin/login
│   │       └── portal/                   # Portal Proveedores
│   │           ├── MisOrdenesPage.tsx    # /portal (OCs pendientes)
│   │           └── LoginPage.tsx         # /portal/login
│   └── package.json
```

## Commands

```bash
# Development (run from root)
npm run dev:backend          # NestJS watch mode on :3000
npm run dev:frontend         # Vite dev server on :5173

# Testing
npm test                     # Backend Jest tests
npm test -- --watch          # Watch mode (from root)

# Build
npm run build --workspace=backend    # NestJS -> dist/
npm run build --workspace=frontend   # tsc + vite -> dist/

# Linting
npm run lint --workspace=backend     # ESLint + Prettier fix
npm run lint --workspace=frontend    # ESLint

# Type checking (frontend only)
cd frontend && npx tsc --noEmit
```

## Architecture

**Monorepo** with `backend/` and `frontend/` npm workspaces. Root `package.json` has convenience scripts prefixed with `dev:`.

### Backend (NestJS 11)

Modular architecture: each feature gets its own module folder under `src/`.

- `main.ts` — bootstrap with Helmet, CORS (restricted via `CORS_ORIGIN` env var), global `ValidationPipe(whitelist, transform)`, body size limit
- `app.module.ts` — root module, imports feature modules + `SupabaseModule`, global rate limiting via `@nestjs/throttler`
- `supabase/` — `@Global()` shared module providing `SupabaseService` to all feature modules
- Feature modules follow the pattern: `src/<feature>/` containing `<feature>.module.ts`, `<feature>.controller.ts`, `<feature>.service.ts`, and DTOs
- DTOs use `class-validator` decorators for request validation
- **Error handling**: services throw NestJS exceptions (`BadRequestException`, `InternalServerErrorException`) — never return `{ success: false, error }` objects
- **Cron/Scheduler**: `@nestjs/schedule` for tareas programadas de seguimiento de OCs

**Core modules**: AppModule (health), SupabaseModule (global), AuthModule (JWT), OrdenesModule, ProveedoresModule, NotificacionesModule, CronModule

**Security**: Helmet, `@nestjs/throttler` (rate limiting), JWT authentication (AuthGuard), CORS, input validation

### Frontend (React 19 + Vite 7)

Multi-portal app using React Router. Two portales separados:

- **Portal Admin** (`/admin/*`): Dashboard de control, gestion de OCs, alertas semaforo, administracion de proveedores. Color Rojo Snoop (#E30613).
- **Portal Proveedores** (`/portal/*`): Vista simplificada de OCs pendientes de accion. Interfaz minima para confirmar hitos con un clic.

Patterns:
- **Routing**: `BrowserRouter` with layout groups for admin and portal
- **Auth**: `AuthContext` — JWT token in localStorage, `ProtectedRoute` wrapper
- **Styling**: CSS Modules + CSS vars in `index.css`. Never hardcode colors.
- **Data fetching**: `fetch` with auth headers, sessionStorage cache where appropriate
- **Env**: `VITE_API_URL` via `import.meta.env.VITE_* ?? ''` (never `as string`)

### Logica de Negocio: Flujo de OC

```
EMITIDA ---(24hs)--> ACEPTADA ---(T-7/T-1/T-0)--> EN_SEGUIMIENTO
  |                                                      |
  +--> NO_ACEPTADA (alerta roja)              T+1: Proveedor confirma?
                                                SI --> ENTREGA_CONFIRMADA --> VALIDADA_CLIENTE --> CERRADA
                                                NO --> INCUMPLIMIENTO
```

El CronService ejecuta periodicamente:
1. Verificar OCs no aceptadas pasadas 24hs → alerta roja
2. Enviar recordatorios T-7, T-1, T-0
3. Verificar entregas T+1 sin respuesta → incumplimiento

## Code Style

- **Backend**: Prettier (single quotes, trailing commas) + ESLint with typescript-eslint
- **Frontend**: ESLint with react-hooks and react-refresh plugins
- CSS Modules for component styling, CSS custom properties in `index.css`
- **Never hardcode colors** — always use CSS variables (`var(--color-*)`)
- Brand color: Rojo Snoop `#E30613` (`--color-primary`)
- All user-facing text in Spanish

## Security

| Env Variable | Where | Purpose |
|-------------|-------|---------|
| `SUPABASE_URL` | `backend/.env` | Supabase project URL |
| `SUPABASE_ANON_KEY` | `backend/.env` | Public anon key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/.env` | Service role key (bypasses RLS) |
| `JWT_SECRET` | `backend/.env` | Secret for signing JWT tokens (min 32 chars) |
| `CORS_ORIGIN` | `backend/.env` | Allowed frontend origin(s), comma-separated |
| `PORT` | `backend/.env` | Backend port (default 3000) |
| `VITE_API_URL` | `frontend/.env` | Backend API URL |

### Roles

- **Admin (Compras)**: Acceso completo al portal de administracion. Crea OCs, gestiona proveedores, ve alertas.
- **Proveedor**: Acceso solo a su portal. Ve sus OCs, confirma hitos.
- **Cliente Interno**: Valida entregas (puede ser un rol separado o una funcionalidad dentro de admin).

## Task Routing Rules

### Skills (invoke via `Skill` tool)

| Skill | Trigger When |
|-------|-------------|
| `nestjs-expert` | Any work inside `backend/`: modules, controllers, services, DTOs, guards, DI, testing |
| `ui-ux-pro-max` | UI/UX design decisions, styles, visual components, accessibility |
| `vercel-react-best-practices` | React components in `frontend/`: performance, hooks, data fetching |
| `postgresql-table-design` | Database schema design, column types, constraints, indexes |
| `supabase-postgres-best-practices` | SQL optimization, RLS policies, Supabase config |

### Subagents (invoke via `Task` tool)

| Subagent | Trigger When |
|----------|-------------|
| `Explore` | Broad codebase exploration, understanding features end-to-end |
| `Plan` | Designing implementation strategy for non-trivial features |
| `Bash` | Shell commands: git, npm, builds, dev servers |
| `general-purpose` | Multi-step research, complex investigations |

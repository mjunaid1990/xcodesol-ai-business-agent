# orbit / AI

The first implementation follows `prompts/master.md`'s Phase 1 foundation and `prompts/admindesign.md`'s workspace dashboard design. The larger AI agent, knowledge, automation, integrations and billing modules are intentionally staged for later phases.

## Stack

- Next.js 15, React 19, TypeScript, Tailwind CSS 4
- PostgreSQL and Prisma
- Signed HTTP-only session cookies, bcrypt password hashes, Zod form validation

## Local setup

1. Install Node.js 20.9 or newer and PostgreSQL 16+.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` plus a random `AUTH_SECRET` of at least 32 characters.
3. Run `npm install`.
4. Run `npm run db:generate` and `npm run db:migrate` to create the foundation tables.
5. Run `npx prisma db seed` to add the built-in roles and permissions.
6. Run `npm run dev` and open `http://localhost:3000`.

New registrations create a workspace and make the registering user its owner. Workspace access is derived from the signed session and checked against active membership on each dashboard request.

## Current foundation

- Registration, sign-in and sign-out
- User, workspace and workspace membership models
- System role and permission seed data
- Workspace switching
- Responsive dark dashboard shell, workspace navigation and sample dashboard metrics
- Placeholder module routes for the remaining workspace navigation

Dashboard activity and KPI values currently come from the design prompt's sample data. Product data models and live metrics will be introduced in their implementation phases.

# xcodesol-ai-business-agent

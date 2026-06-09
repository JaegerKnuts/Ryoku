# RYOKU — Hash Archive

Archivo independiente sobre hash culture. Merch y herramientas seleccionadas.

## Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL (Neon via Prisma)
- **Auth:** NextAuth.js (Credentials)
- **Payments:** Stripe
- **Storage:** Vercel Blob
- **Deploy:** Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local  # configura DB y Stripe
npm run dev
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción |
| `npm run db:migrate` | Migraciones Prisma |
| `npm run db:studio` | Prisma Studio |
| `npm test` | Tests E2E Playwright |

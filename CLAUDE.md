# CLAUDE.md - Projektguide för Claude Code

## Projekt: Lead Auditor Training Simulation

### Tech Stack
- Next.js 16.1.6 (App Router)
- Prisma 7.3.0 med PostgreSQL (Neon)
- NextAuth v5 (beta)
- Tailwind CSS 4
- Deployed på Vercel

### Lärdomar och Best Practices

#### Next.js 16 + Vercel
1. **middleware.ts är deprecated** - använd `proxy.ts` istället
2. **Proxy-export**: Måste vara `export async function proxy(request)` - inte default export
3. **vercel.json**: Lägg alltid till `{"framework": "nextjs"}` för att undvika att Vercel missar framework
4. **Kontrollera Framework Preset** i Vercel Dashboard om 404-fel uppstår

#### NextAuth v5 + Next.js 16
1. **Separera auth-konfiguration**:
   - `src/auth.config.ts` - Edge-kompatibel config (utan Prisma)
   - `src/lib/auth.ts` - Full config med providers och Prisma
2. **Proxy wrapper**: auth() måste wrappas i en async function för proxy.ts

#### Vercel Deploy
1. Kör `vercel link` och välj rätt projekt
2. Kontrollera miljövariabler med `vercel env ls`
3. Vid 404: Kontrollera att Framework Preset = Next.js (inte "Other")

### Projektstruktur
```
src/
├── app/
│   ├── api/auth/        # NextAuth routes
│   ├── auth/            # Login/register sidor
│   └── dashboard/       # Skyddade sidor
├── lib/
│   ├── auth.ts          # NextAuth config med providers
│   └── prisma.ts        # Prisma client
├── auth.config.ts       # Edge-kompatibel auth config
└── proxy.ts             # Next.js 16 proxy (ersätter middleware)
```

### Kommandon
- `npm run dev` - Starta utvecklingsserver
- `npm run build` - Bygg för produktion
- `npx prisma studio` - Öppna Prisma Studio
- `vercel env pull` - Hämta miljövariabler från Vercel

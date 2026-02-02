# Lead Audit Simulering

En interaktiv träningssimulator för ledningssystemsrevisorer enligt ISO 19011.

## Beskrivning

Simulatorn agerar som Auditee och Bedömare för att ge realistisk revisionsträning med:
- Startmöte
- Revisionsaktiviteter
- Slutmöte
- Bedömning enligt ISO 19011 kompetenskrav

### Fiktivt företag

Träningen sker mot det fiktiva företaget **Nordisk Precision AB**:
- 180 anställda
- Tillverkande verkstadsindustri
- Certifieringar: ISO 9001, ISO 14001, ISO 45001, IATF 16949

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Databas:** PostgreSQL
- **AI:** Claude AI API (Anthropic)
- **Auth:** NextAuth.js
- **Deployment:** Vercel

## Installation

1. Klona repot:
   ```bash
   git clone https://github.com/fz7jjhvdk4-create/Lead-audit.git
   cd Lead-audit/lead-audit-app
   ```

2. Installera dependencies:
   ```bash
   npm install
   ```

3. Kopiera miljövariabler:
   ```bash
   cp .env.example .env.local
   ```

4. Fyll i miljövariablerna i `.env.local`

5. Kör databas-migrationer:
   ```bash
   npx prisma migrate dev
   ```

6. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```

7. Öppna [http://localhost:3000](http://localhost:3000)

## Annex SL-struktur

Simulatorn bygger på Annex SL (ISO High Level Structure) - den gemensamma ramstrukturen för alla ISO-ledningssystemstandarder:

| Kapitel | Titel |
|---------|-------|
| 4 | Organisationens förutsättningar |
| 5 | Ledarskap |
| 6 | Planering |
| 7 | Stöd |
| 8 | Verksamhet |
| 9 | Utvärdering av prestanda |
| 10 | Förbättring |

## Scripts

- `npm run dev` - Starta utvecklingsserver
- `npm run build` - Bygg för produktion
- `npm run start` - Starta produktionsserver
- `npm run lint` - Kör ESLint
- `npm run format` - Formatera kod med Prettier

## Licens

Privat projekt.

# Theorie Moerad

Theorie examen platform gebouwd met Next.js en Prisma.

## Supabase Client Configuratie

Dit project bevat een Supabase client voor directe interactie met Supabase services (zoals Auth, Realtime, Storage).

### API Keys Ophalen

1. Ga naar [supabase.com/dashboard](https://supabase.com/dashboard) en log in
2. Selecteer je project (of maak een nieuw project aan)
3. Ga naar **Project Settings** → **API**
4. Hier vind je:
   - **Project URL** → gebruik voor `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → gebruik voor `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Environment Variables Instellen

Kopieer het `.env.example` bestand naar `.env` en vul de Supabase waarden in:

```bash
cp .env.example .env
```

Bewerk `.env` en voeg je Supabase credentials toe:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### Gebruik in de Applicatie

De Supabase client is beschikbaar via `lib/supabase.ts`:

```typescript
import { supabase } from '@/lib/supabase'

// Voorbeeld: data ophalen
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Voorbeeld: authenticatie
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

### Applicatie Starten

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev
```

De applicatie draait op [http://localhost:3000](http://localhost:3000).

## Deployment op Render met Supabase

Deze applicatie gebruikt **Supabase** als database provider. Render wordt alleen gebruikt voor hosting van de Next.js applicatie.

### Stap 1: Supabase Database Configureren

1. Ga naar [supabase.com](https://supabase.com) en log in of maak een account aan
2. Maak een nieuw project aan (of gebruik een bestaand project)
3. Ga naar **Project Settings** → **Database**
4. Onder **Connection string** vind je de connection strings. Je hebt twee URLs nodig:

   **DATABASE_URL** (Session mode - met connection pooler):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```
   
   **DIRECT_URL** (Direct connection - voor Prisma migraties):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```

   > **Let op**: De DATABASE_URL gebruikt poort **6543** (pooler) en de DIRECT_URL gebruikt poort **5432** (direct).

### Stap 2: Deployment via Render Blueprint

1. Ga naar [render.com](https://render.com) en log in met je GitHub account
2. Klik op "New +" → "Blueprint"
3. Selecteer deze repository `Mikeyy1405/Theorie-moerad`
4. Render gebruikt automatisch het `render.yaml` configuratiebestand
5. **Configureer de volgende environment variables handmatig**:
   - `DATABASE_URL` - Je Supabase Session mode connection string (poort 6543)
   - `DIRECT_URL` - Je Supabase Direct connection string (poort 5432)
   - `NEXTAUTH_URL` - Je Render app URL (bijv. `https://theorie-moerad.onrender.com`)
   - `NEXTAUTH_SECRET` - Wordt automatisch gegenereerd
6. Klik op "Apply" om de deployment te starten

### Handmatige deployment

1. Ga naar [render.com](https://render.com) en log in
2. Maak een nieuwe Web Service aan:
   - Klik op "New +" → "Web Service"
   - Verbind deze GitHub repository
   - Configureer de instellingen:
     - **Name**: theorie-moerad
     - **Environment**: Node
     - **Region**: Frankfurt (of dichtstbijzijnde)
     - **Branch**: main
     - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
     - **Start Command**: `npm start`
3. Voeg environment variables toe:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Je Supabase Session mode connection string (poort 6543)
   - `DIRECT_URL`: Je Supabase Direct connection string (poort 5432)
   - `NEXTAUTH_URL`: Je Render service URL
   - `NEXTAUTH_SECRET`: Genereer een random string
4. Klik op "Create Web Service"

### Na deployment

De database migraties worden automatisch uitgevoerd tijdens de build. Na de eerste succesvolle deployment:
1. (Optioneel) Voor seed data, ga naar je Web Service dashboard op Render
2. Klik op "Shell" in het linker menu
3. Voer het volgende commando uit: `npm run prisma:seed` (als je een seed script hebt)

### Environment Variables Referentie

| Variable | Beschrijving | Voorbeeld |
|----------|--------------|-----------|
| `NODE_ENV` | Moet `production` zijn | `production` |
| `DATABASE_URL` | Supabase Session mode (poort 6543) | `postgresql://postgres.[ref]:[pwd]@...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | Supabase Direct connection (poort 5432) | `postgresql://postgres.[ref]:[pwd]@...pooler.supabase.com:5432/postgres` |
| `NEXTAUTH_URL` | De volledige URL van je deployed applicatie | `https://theorie-moerad.onrender.com` |
| `NEXTAUTH_SECRET` | Een willekeurige string voor JWT encryptie | Gebruik een password generator |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL voor client SDK | `https://your-project-ref.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key voor client SDK | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Waarom twee database URLs?

Supabase gebruikt **PgBouncer** voor connection pooling:
- **DATABASE_URL** (poort 6543): Gebruikt connection pooling voor efficiënte database connecties in productie
- **DIRECT_URL** (poort 5432): Directe connectie nodig voor Prisma migraties en schema wijzigingen

Prisma heeft de `directUrl` nodig omdat sommige operaties (zoals migraties) niet compatibel zijn met connection poolers.

### Troubleshooting

- **Build faalt**: Check de build logs in het Render dashboard
- **Database connectie problemen**: 
  - Verifieer dat beide `DATABASE_URL` en `DIRECT_URL` correct zijn ingesteld
  - Controleer of de poorten correct zijn (6543 voor DATABASE_URL, 5432 voor DIRECT_URL)
  - Zorg dat `?pgbouncer=true&connection_limit=1` is toegevoegd aan de DATABASE_URL
- **Migratie problemen**: Controleer of de `DIRECT_URL` correct is ingesteld (poort 5432)

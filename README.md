# Theorie Moerad

Theorie examen platform gebouwd met Next.js en Prisma.

## Deployment op Render

### Automatische deployment via Blueprint

1. Ga naar [render.com](https://render.com) en log in met je GitHub account
2. Klik op "New +" → "Blueprint"
3. Selecteer deze repository `Mikeyy1405/Theorie-moerad`
4. Render gebruikt automatisch het `render.yaml` configuratiebestand
5. Configureer de volgende environment variables:
   - `DATABASE_URL` - Wordt automatisch gekoppeld aan de Render PostgreSQL database
   - `NEXTAUTH_URL` - Je Render app URL (bijv. `https://theorie-moerad.onrender.com`)
   - `NEXTAUTH_SECRET` - Wordt automatisch gegenereerd
6. Klik op "Apply" om de deployment te starten

### Handmatige deployment

1. Ga naar [render.com](https://render.com) en log in
2. Maak een nieuwe PostgreSQL database aan:
   - Klik op "New +" → "PostgreSQL"
   - Geef een naam (bijv. `theorie-moerad-db`)
   - Selecteer de free plan
   - Klik op "Create Database"
3. Maak een nieuwe Web Service aan:
   - Klik op "New +" → "Web Service"
   - Verbind deze GitHub repository
   - Configureer de instellingen:
     - **Name**: theorie-moerad
     - **Environment**: Node
     - **Region**: Frankfurt (of dichtstbijzijnde)
     - **Branch**: main
     - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
     - **Start Command**: `npm start`
4. Voeg environment variables toe:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Kopieer de Internal Database URL van je PostgreSQL database
   - `NEXTAUTH_URL`: Je Render service URL
   - `NEXTAUTH_SECRET`: Genereer een random string
5. Klik op "Create Web Service"

### Na deployment

De database migraties worden automatisch uitgevoerd tijdens de build. Na de eerste succesvolle deployment:
1. (Optioneel) Voor seed data, ga naar je Web Service dashboard op Render
2. Klik op "Shell" in het linker menu
3. Voer het volgende commando uit: `npm run prisma:seed` (als je een seed script hebt)

### Environment Variables Referentie

- `NODE_ENV`: Moet `production` zijn
- `DATABASE_URL`: PostgreSQL connection string (formaat: `postgresql://user:password@host:port/database`)
- `NEXTAUTH_URL`: De volledige URL van je deployed applicatie
- `NEXTAUTH_SECRET`: Een willekeurige string voor JWT encryptie (gebruik een password generator)

### Troubleshooting

- Als de build faalt, check de build logs in het Render dashboard
- Zorg ervoor dat alle environment variables correct zijn ingesteld
- Voor database connectie problemen, verifieer dat `DATABASE_URL` correct is gekoppeld

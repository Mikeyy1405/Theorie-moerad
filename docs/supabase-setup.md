# Supabase Setup Instructions

## Database Trigger for User Profile Creation

After deploying the Prisma schema, run this SQL in your Supabase SQL Editor to automatically create profile records when users sign up:

```sql
-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, first_name, last_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Email Confirmation Settings

For development/testing, you may want to disable email confirmation:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle off **"Confirm email"**

For production, keep email confirmation enabled for security.

## Environment Variables

Make sure these are set in your Render deployment:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `DATABASE_URL` - Supabase connection string (port 6543)
- `DIRECT_URL` - Supabase direct connection (port 5432)
- `NEXTAUTH_URL` - Your deployed app URL
- `NEXTAUTH_SECRET` - Random secret string

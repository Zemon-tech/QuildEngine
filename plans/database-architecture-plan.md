# Quild Engine — Supabase Authentication Schema (Phase 1)

This document outlines the minimal database schema and Supabase configuration required for **Phase 1: Authentication** in the Quild Engine platform. It acts as the single source of truth for user profiles, roles, and administrative statuses.

---

## 1. Directory Structure

```
quild/
└── apps/
    └── api/
        └── sql/
            └── 001-profiles.sql
```

---

## 2. Authentication Schema & Migration

### Migration: `001-profiles.sql`
- Restricts roles to `admin`, `moderator`, and `user` using robust, standard `TEXT CHECK` constraints (avoiding rigid PG custom enum types).
- Creates a `profiles` table to hold user identities, roles, statuses, and basic settings.
- Automatically provisions a public user profile when a user registers on Supabase Auth. It handles uniqueness for usernames by appending incremented values if a prefix collision occurs.
- Configures database triggers to sync admin role updates back into the user's JWT claims.
- Establishes RLS policies ensuring secure read/write boundaries.

```sql
-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL, -- Mirrored from auth.users for fast admin query lookups
    username TEXT UNIQUE NOT NULL, -- Used for public URLs: quild.in/username, must be unique
    display_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    timezone TEXT NOT NULL DEFAULT 'UTC',
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Robust Indexes for Fast Access & Analytics
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON public.profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active_at ON public.profiles(last_active_at);

-- 3. Trigger to provision profile on new auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Extract username prefix from email
  base_username := split_part(NEW.email, '@', 1);
  final_username := base_username;

  -- Ensure uniqueness of username
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;

  INSERT INTO public.profiles (
    id, 
    email,
    username,
    display_name, 
    role,
    status,
    timezone, 
    social_links,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    NEW.email,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    'active',
    'UTC',
    '{}'::jsonb,
    false
  );
  
  -- Seed the default claims in auth.users app_metadata so the JWT contains them immediately
  UPDATE auth.users
  SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) 
    || jsonb_build_object('role', 'user', 'status', 'active')
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_on_auth_user_created ON auth.users;

CREATE TRIGGER tr_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- 4. Trigger to synchronize profile edits (role/status) back to auth.users app_metadata
-- When the admin edits the role/status field in public.profiles, this trigger pushes the updates
-- into auth.users.raw_app_meta_data. This ensures the user's JWT claims stay in sync.
CREATE OR REPLACE FUNCTION public.sync_profile_updates_to_auth()
RETURNS trigger AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role OR OLD.status IS DISTINCT FROM NEW.status THEN
    UPDATE auth.users
    SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) 
      || jsonb_build_object('role', NEW.role, 'status', NEW.status)
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_on_profile_updated ON public.profiles;

CREATE TRIGGER tr_on_profile_updated
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_updates_to_auth();

-- 5. Trigger to prevent non-admins from updating role/status fields
CREATE OR REPLACE FUNCTION public.check_profile_updates()
RETURNS trigger AS $$
BEGIN
  -- Only restrict updates if they are made by authenticated users through client APIs
  IF auth.role() = 'authenticated' THEN
    IF OLD.role IS DISTINCT FROM NEW.role OR OLD.status IS DISTINCT FROM NEW.status THEN
      IF NOT (coalesce(auth.jwt()->'app_metadata'->>'role', '') = 'admin') THEN
        RAISE EXCEPTION 'Access Denied: Only administrators can modify user roles or statuses.';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_before_profile_updated ON public.profiles;

CREATE TRIGGER tr_before_profile_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.check_profile_updates();

-- 6. Row-Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are visible to everyone" ON public.profiles;
CREATE POLICY "Public profiles are visible to everyone" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile fields" ON public.profiles;
CREATE POLICY "Users can update their own profile fields" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);
```
```

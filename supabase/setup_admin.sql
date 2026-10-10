-- ==============================================================================
-- GL BAJAJ ALUMNI CONNECT - SETUP FIRST ADMIN ACCOUNT
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- STEP 1: Replace 'admin@glbitm.ac.in' with your chosen admin email.
-- (Make sure you have created this user first in Supabase: 
--  Authentication -> Users -> "Add User" -> "Create User")

DO $$
DECLARE
  target_email TEXT := 'admin@glbitm.ac.in'; -- <-- Change this to your admin email
  target_user_id UUID;
BEGIN
  -- Find the user's UUID from Supabase Auth
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE LOWER(TRIM(email)) = LOWER(TRIM(target_email));

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User % not found in auth.users. Please go to Supabase Dashboard -> Authentication -> Users -> Add user, create the user, and then run this script.', target_email;
  END IF;

  -- 1. Insert or update public.profiles with role = 'admin'
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    target_user_id,
    LOWER(TRIM(target_email)),
    'GL Bajaj Administrator',
    'admin'
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    role = 'admin',
    full_name = 'GL Bajaj Administrator',
    updated_at = NOW();

  -- 2. Insert or update public.admins record
  INSERT INTO public.admins (user_id, department, designation)
  VALUES (
    target_user_id,
    'Dean Alumni Relations & Central Administration',
    'Chief Administrator'
  )
  ON CONFLICT (user_id) DO UPDATE 
  SET 
    designation = 'Chief Administrator',
    department = 'Dean Alumni Relations & Central Administration';

  RAISE NOTICE 'SUCCESS: User % has been granted role = admin and added to admins table.', target_email;
END $$;

-- Verify the admin was created correctly:
SELECT 
  p.id, 
  p.email, 
  p.full_name, 
  p.role, 
  a.department, 
  a.designation 
FROM public.profiles p
JOIN public.admins a ON a.user_id = p.id
WHERE p.role = 'admin';

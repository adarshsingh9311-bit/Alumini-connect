-- ==============================================================================
-- GL BAJAJ ALUMNI CONNECT - DATABASE TRIGGER & RLS POLICY REPAIR
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Ensure RLS policies on 'students' match the real database schema (id = auth.uid())
DROP POLICY IF EXISTS "Students directory viewable by authenticated users" ON public.students;
DROP POLICY IF EXISTS "Student can insert own record" ON public.students;
DROP POLICY IF EXISTS "Student can update own record" ON public.students;

CREATE POLICY "Students directory viewable by authenticated users"
  ON public.students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Student can insert own record"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id OR is_admin());

CREATE POLICY "Student can update own record"
  ON public.students FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin());

-- 2. Ensure RLS policies on 'alumni' match the real database schema (id = auth.uid())
DROP POLICY IF EXISTS "Alumni directory viewable by all (anon sees verified)" ON public.alumni;
DROP POLICY IF EXISTS "Alumni can insert own record" ON public.alumni;
DROP POLICY IF EXISTS "Alumni can update own record, Admin can verify" ON public.alumni;

CREATE POLICY "Alumni directory viewable by all (anon sees verified)"
  ON public.alumni FOR SELECT
  USING (true);

CREATE POLICY "Alumni can insert own record"
  ON public.alumni FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id OR is_admin());

CREATE POLICY "Alumni can update own record, Admin can verify"
  ON public.alumni FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin());

-- 3. Update public.handle_new_user() trigger to automatically provision
--    profiles, students, or alumni records with SECURITY DEFINER privileges.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
  user_roll TEXT;
  user_branch TEXT;
  user_batch TEXT;
  user_grad_year INT;
  user_phone TEXT;
  user_skills TEXT[];
  user_bio TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));
  user_roll := NEW.raw_user_meta_data->>'roll_number';
  user_branch := COALESCE(NEW.raw_user_meta_data->>'branch', 'CSE');
  user_batch := COALESCE(NEW.raw_user_meta_data->>'batch', '2023-2027');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_bio := COALESCE(NEW.raw_user_meta_data->>'bio', '');
  
  BEGIN
    user_grad_year := (NEW.raw_user_meta_data->>'graduation_year')::INT;
  EXCEPTION WHEN OTHERS THEN
    user_grad_year := 2027;
  END;

  -- 3a. Provision or update base profile
  INSERT INTO public.profiles (id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_role,
    user_phone
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

  -- 3b. If student, provision in students table
  IF user_role = 'student' AND user_roll IS NOT NULL THEN
    INSERT INTO public.students (id, roll_number, branch, batch, graduation_year, bio)
    VALUES (
      NEW.id,
      user_roll,
      user_branch,
      user_batch,
      user_grad_year,
      user_bio
    )
    ON CONFLICT (id) DO UPDATE SET
      roll_number = EXCLUDED.roll_number,
      branch = EXCLUDED.branch,
      batch = EXCLUDED.batch,
      graduation_year = EXCLUDED.graduation_year,
      updated_at = NOW();

  -- 3c. If alumni, provision in alumni table
  ELSIF user_role = 'alumni' AND user_roll IS NOT NULL THEN
    INSERT INTO public.alumni (
      id,
      roll_number,
      branch,
      batch,
      graduation_year,
      current_company,
      current_designation,
      industry,
      location,
      bio,
      mentorship_available,
      verified
    )
    VALUES (
      NEW.id,
      user_roll,
      user_branch,
      user_batch,
      user_grad_year,
      COALESCE(NEW.raw_user_meta_data->>'current_company', ''),
      COALESCE(NEW.raw_user_meta_data->>'current_designation', ''),
      COALESCE(NEW.raw_user_meta_data->>'industry', ''),
      COALESCE(NEW.raw_user_meta_data->>'location', ''),
      user_bio,
      TRUE,
      FALSE
    )
    ON CONFLICT (id) DO UPDATE SET
      roll_number = EXCLUDED.roll_number,
      branch = EXCLUDED.branch,
      batch = EXCLUDED.batch,
      graduation_year = EXCLUDED.graduation_year,
      updated_at = NOW();

  -- 3d. If admin, provision in admins table
  ELSIF user_role = 'admin' THEN
    INSERT INTO public.admins (id, designation)
    VALUES (NEW.id, 'Administrator')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- GL BAJAJ INSTITUTE OF TECHNOLOGY & MANAGEMENT - ALUMNI CONNECT
-- PRODUCTION DATABASE SCHEMA & POLICIES FOR SUPABASE POSTGRESQL
-- "Once GLB, Always GLB."
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP EXISTING OBJECTS (If re-running migration cleanly)
-- DROP TABLE IF EXISTS daily_thoughts CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS achievements CASCADE;
-- DROP TABLE IF EXISTS events CASCADE;
-- DROP TABLE IF EXISTS notices CASCADE;
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS mentorship_requests CASCADE;
-- DROP TABLE IF EXISTS career_history CASCADE;
-- DROP TABLE IF EXISTS import_history CASCADE;
-- DROP TABLE IF EXISTS admins CASCADE;
-- DROP TABLE IF EXISTS alumni CASCADE;
-- DROP TABLE IF EXISTS students CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ==============================================================================
-- 3. PROFILES TABLE (Core user identities mapped to auth.users)
-- Exactly THREE roles: 'student', 'alumni', 'admin'
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'alumni', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for role lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ==============================================================================
-- 4. STUDENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  roll_number TEXT NOT NULL UNIQUE,
  branch TEXT NOT NULL,
  batch_year TEXT,
  semester TEXT,
  cgpa TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT,
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);

-- ==============================================================================
-- 5. ALUMNI TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS alumni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  roll_number TEXT,
  graduation_year TEXT,
  branch TEXT NOT NULL,
  degree TEXT DEFAULT 'B.Tech',
  current_company TEXT,
  current_designation TEXT,
  industry TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  is_available_for_mentorship BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  mentor_topics TEXT[] DEFAULT '{}',
  mentor_capacity INT DEFAULT 5,
  years_of_experience INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_alumni_roll_number ON alumni(roll_number);
CREATE INDEX IF NOT EXISTS idx_alumni_user_id ON alumni(user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_is_verified ON alumni(is_verified);
CREATE INDEX IF NOT EXISTS idx_alumni_company ON alumni(current_company);
CREATE INDEX IF NOT EXISTS idx_alumni_branch ON alumni(branch);

-- ==============================================================================
-- 6. ADMINS TABLE
-- Pre-authorized administration team only
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  employee_id TEXT,
  department TEXT DEFAULT 'Dean Alumni Relations & Central Administration',
  designation TEXT DEFAULT 'Administrator',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- ==============================================================================
-- 7. CAREER HISTORY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS career_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumni_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  designation TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_career_history_alumni ON career_history(alumni_id);

-- ==============================================================================
-- 8. MENTORSHIP REQUESTS TABLE
-- Life cycle: pending -> accepted | rejected -> completed
-- ==============================================================================
CREATE TABLE IF NOT EXISTS mentorship_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT,
  message TEXT NOT NULL,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  response_note TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mentorship_student ON mentorship_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_alumni ON mentorship_requests(alumni_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_status ON mentorship_requests(status);

-- ==============================================================================
-- 9. MESSAGES TABLE (Realtime Chat)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ==============================================================================
-- 10. NOTICES & BROADCASTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'high')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'alumni')),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notices_target ON notices(target_audience);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);

-- ==============================================================================
-- 11. EVENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  event_type TEXT DEFAULT 'offline' CHECK (event_type IN ('offline', 'online', 'hybrid')),
  image_url TEXT,
  registration_link TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published);

-- ==============================================================================
-- 12. ACHIEVEMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumni_id UUID REFERENCES alumni(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT,
  category TEXT DEFAULT 'Career',
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_achievements_approved ON achievements(is_approved);

-- ==============================================================================
-- 13. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ==============================================================================
-- 14. DAILY THOUGHTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS daily_thoughts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'GLB Alumni Connect',
  category TEXT DEFAULT 'Motivation',
  publish_date DATE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_daily_thoughts_date ON daily_thoughts(publish_date);

-- ==============================================================================
-- 15. SPREADSHEET IMPORT HISTORY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS import_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  record_count INT NOT NULL,
  imported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_history ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles can be viewed by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public profiles viewable by anyone on landing page"
  ON profiles FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin());

-- STUDENTS POLICIES
CREATE POLICY "Students directory viewable by authenticated users"
  ON students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Student can insert own record"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "Student can update own record"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- ALUMNI POLICIES
CREATE POLICY "Alumni directory viewable by all (anon sees verified)"
  ON alumni FOR SELECT
  USING (true);

CREATE POLICY "Alumni can insert own record"
  ON alumni FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "Alumni can update own record, Admin can verify"
  ON alumni FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- ADMINS POLICIES
CREATE POLICY "Admins viewable by authenticated"
  ON admins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins managed by admin only"
  ON admins FOR ALL
  TO authenticated
  USING (is_admin());

-- CAREER HISTORY POLICIES
CREATE POLICY "Career history viewable by everyone"
  ON career_history FOR SELECT
  USING (true);

CREATE POLICY "Alumni can manage own career history"
  ON career_history FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM alumni WHERE alumni.id = career_history.alumni_id AND alumni.user_id = auth.uid())
    OR is_admin()
  );

-- MENTORSHIP REQUESTS POLICIES
CREATE POLICY "Mentorship requests visible to participants and admins"
  ON mentorship_requests FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() 
    OR alumni_id = auth.uid() 
    OR is_admin()
  );

CREATE POLICY "Students can create mentorship requests"
  ON mentorship_requests FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Participants and admins can update mentorship requests"
  ON mentorship_requests FOR UPDATE
  TO authenticated
  USING (
    student_id = auth.uid() 
    OR alumni_id = auth.uid() 
    OR is_admin()
  );

-- MESSAGES POLICIES
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update read status on received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid());

-- NOTICES POLICIES
CREATE POLICY "Notices viewable by anyone"
  ON notices FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage notices"
  ON notices FOR ALL
  TO authenticated
  USING (is_admin());

-- EVENTS POLICIES
CREATE POLICY "Events viewable by anyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (is_admin());

-- ACHIEVEMENTS POLICIES
CREATE POLICY "Achievements viewable by anyone"
  ON achievements FOR SELECT
  USING (is_approved = true OR is_admin() OR auth.uid() IN (SELECT user_id FROM alumni WHERE id = achievements.alumni_id));

CREATE POLICY "Alumni can submit achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can approve or manage achievements"
  ON achievements FOR ALL
  TO authenticated
  USING (is_admin());

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users see only their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications (mark read)"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System/Admins can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- DAILY THOUGHTS POLICIES
CREATE POLICY "Daily thoughts viewable by anyone"
  ON daily_thoughts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage daily thoughts"
  ON daily_thoughts FOR ALL
  TO authenticated
  USING (is_admin());

-- IMPORT HISTORY POLICIES
CREATE POLICY "Import history managed by admins"
  ON import_history FOR ALL
  TO authenticated
  USING (is_admin());

-- ==============================================================================
-- 17. AUTOMATIC USER TRIGGER (Optional convenience helper)
-- Automatically inserts a row into public.profiles on auth.users signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 18. ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'mentorship_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE mentorship_requests;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore if realtime is managed by Supabase dashboard
END $$;
